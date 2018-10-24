var path          = require('path');
var express       = require('express');
var session       = require('express-session');
var bodyParser    = require('body-parser');
var fs 			  = require('fs');

var JSZip 		  = require('jszip');
var Docxtemplater = require('docxtemplater');

var QueryEng      = require('./local_modules/dbcengine/QueryEngine');
var DBEng         = require('./local_modules/dbcengine/DBEngine');
var Utils         = require('./local_modules/utils/Utils');
var WorkspaceKeep = require('./local_modules/utils/WorkspaceKeeper');
var TemplateProv  = require('./local_modules/utils/TemplateProvider');

//router
var dCardRouter = express.Router();
//connection pool instance
var connectionPool = QueryEng.createPool();
//init session
dCardRouter.use(
    session({
        secret: 'secret',
        resave: false,
        saveUninitialized: true
    }),
    function(req, res, next){
        //...
        next();
    }
);
//support json encoded bodies
dCardRouter.use(bodyParser.json());
//support encoded bodies
dCardRouter.use(bodyParser.urlencoded({ extended: true }));
//create session credentials if they don't exist yet
dCardRouter.use(function (req, res, next) {
    if (!req.session.credentials) {
        req.session.credentials = {};
    }
    next();
});

//CORS functionality headers
/*
dCardRouter.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
*/

//force loading index.hmlt from frontend directory
dCardRouter.get('/', async function(req, res, next) {
    //res.send('EXIT-LOG backend node version: 0.1.0');
    res.sendFile(path.join(__dirname + '/frontend/index.html'));
});
//after GET '/'
//backend.use(express.static('frontend'));

//post answer at the url-base kind of "greetings"
dCardRouter.post('/', function(req, res, next) {
    res.send('D-card-index backend node version: 0.1.0');
});

//
//login
dCardRouter.post('/login', async function(req, res, next) {
    if (req.body.id &&
        req.body.usr &&
        req.body.pwd &&
        req.body.id === 'isuservalid') {
        
        var workspace = new WorkspaceKeep(req.session, connectionPool);
        /*workspace.doLogin(req.body.usr, req.body.pwd)
            .then((result) => {
                res.send(result);
            });*/
        res.send(await workspace.doLogin(req.body.usr, req.body.pwd));
    } else {
        res.send('ERROR_POSTDATA_INCORRECT');
    }
});
//logout
dCardRouter.post('/logout', async function(req, res, next){
    var workspace = new WorkspaceKeep(req.session, connectionPool);
    workspace.doLogout();
    res.send('Logged out');
});
//load workspace
dCardRouter.post('/load_workspace', async function(req, res, next){
    if (req.body.userid && req.body.userrole) {
        var workspace = new WorkspaceKeep(req.session, connectionPool);
        res.send(await workspace.loadWorkspace(parseInt(req.body.userid), parseInt(req.body.userrole)));
    } else {
        res.send('0');
    }
});
//keep workspace
dCardRouter.post('/keep_workspace', async function(req, res, next){
    var workspace = new WorkspaceKeep(req.session, connectionPool);
    res.send(await workspace.keepWorkspace());
});
//draw panel
dCardRouter.post('/draw_panel', async function(req, res, next){
    var tmplProvider = new TemplateProv();
    tmplProvider.set('userfio', req.session.credentials.exitUsrFio || '');
    tmplProvider.set('userid', req.session.credentials.exitUsrId || '');
    
    if (Utils.checkPermission(req.session, 1)) {//1 -- for main-inspector usage
        tmplProvider.set('hide', '');
    } else if (Utils.checkPermission(req.session, 3)) {//3 -- for inspector usage
        tmplProvider.set('hide', 'style="display:none;"');
    }
    
    res.send(await tmplProvider.loadTemplate('./local_modules/templates/', req.body.tmplname));
});
//select users
dCardRouter.post('/select_users', async function(req, res, next){
    //1 -- for main-inspector usage
    if (Utils.checkPermission(req.session, 1)) {
        var postData = {};
        postData.page = parseInt(req.body.page);
        postData.perPage = 25;
        postData.startPosition = postData.perPage * postData.page;
        
        postData.userfio = Utils.createRegExp(req.body.userfio,'STARTS_FROM');
        
        var dbEngine = new DBEng(req.session, connectionPool);
        res.send(await dbEngine.selectData('select_users', postData));
    } else {
        res.send('ERROR_ACCESS_DENIED');
    }
});
//lock user
dCardRouter.post('/lock_user', async function(req, res, next){
    //1 -- for main-inspector usage
    if (Utils.checkPermission(req.session, 1)) {
        var postData = {};
        postData.id = parseInt(req.body.id);
        
        var dbEngine = new DBEng(req.session, connectionPool);
        res.send(await dbEngine.uncontrolledChangeData('lock_user', postData));
    } else {
        res.send('ERROR_ACCESS_DENIED');
    }
});
//unlock user
dCardRouter.post('/unlock_user', async function(req, res, next){
    //1 -- for main-inspector usage
    if (Utils.checkPermission(req.session, 1)) {
        var postData = {};
        postData.id = parseInt(req.body.id);
        
        var dbEngine = new DBEng(req.session, connectionPool);
        res.send(await dbEngine.uncontrolledChangeData('unlock_user', postData));
    } else {
        res.send('ERROR_ACCESS_DENIED');
    }
});
//update user
dCardRouter.post('/update_user', async function(req, res, next){
    //1 -- for main-inspector usage | 3 -- for inspector usage
    if (Utils.checkPermission(req.session, 1) || Utils.checkPermission(req.session, 3)) {
        var postData = {};
        postData.id         = parseInt(req.body.id);
        postData.fio        = Utils.formatValue(req.body.fio);
		postData.login      = Utils.formatValue(req.body.login || '');
        postData.pass       = req.body.pass;
        postData.firstlogin = parseInt(req.body.firstlogin);
        
        var dbEngine = new DBEng(req.session, connectionPool);
        res.send(await dbEngine.uncontrolledChangeData('update_user', postData));
    } else {
        res.send('ERROR_ACCESS_DENIED');
    }
});
//select user by ID
dCardRouter.post('/select_user_by_id', async function(req, res, next){
    //1 -- for main-inspector usage
    if (Utils.checkPermission(req.session, 1)) {
        var dbEngine = new DBEng(req.session, connectionPool);
        res.send(await dbEngine.selectDataByID('select_user_by_id', parseInt(req.body.id)));
    } else {
        res.send('ERROR_ACCESS_DENIED');
    }
});
//insert user
dCardRouter.post('/insert_user', async function(req, res, next){
    //1 -- for main-inspector usage
    if (Utils.checkPermission(req.session, 1)) {
		var postData = {};
        postData.fio        = Utils.formatValue(req.body.fio);
		postData.login		= Utils.formatValue(req.body.login);
        postData.pass       = req.body.pass;
        postData.role 		= parseInt(req.body.role);
		
        var dbEngine = new DBEng(req.session, connectionPool);
        res.send(await dbEngine.uncontrolledChangeData('insert_user', postData));
    } else {
        res.send('ERROR_ACCESS_DENIED');
    }
});
//select patients
dCardRouter.post('/select_patients', async function(req, res, next){
    //1 -- for main-inspector usage | 3 -- for inspector usage
    if (Utils.checkPermission(req.session, 1) || Utils.checkPermission(req.session, 3)) {
        var postData = {};
        postData.page = parseInt(req.body.page);
        postData.perPage = 25;
        postData.startPosition = postData.perPage * postData.page;
        
		postData.birthdate	= Utils.createRegExp(Utils.dateConvert(req.body.birthdate,'BACK_END'),'EQUALS');
        postData.fio		= Utils.createRegExp(req.body.fio,'STARTS_FROM');
		postData.ambnum    	= Utils.createRegExp(req.body.ambnum,'STARTS_FROM');
        postData.id     	= Utils.createRegExp(req.body.id,'EQUALS');
        
        var dbEngine = new DBEng(req.session, connectionPool);
        res.send(await dbEngine.selectData('select_patients', postData));
    } else {
        res.send('ERROR_ACCESS_DENIED');
    }
});
//update patient
dCardRouter.post('/update_patient', async function(req, res, next){
    //1 -- for main-inspector usage | 3 -- for inspector usage
    if (Utils.checkPermission(req.session, 1) || Utils.checkPermission(req.session, 3)) {
        var postData = {};
        postData.id         = parseInt(req.body.id);
        postData.fio		= Utils.formatValue(req.body.fio);
		postData.birthdate	= (Utils.formatValue(req.body.birthdate) !== null ? Utils.dateConvert(req.body.birthdate,'BACK_END') : null);
        postData.height		= Utils.formatValue(req.body.height);
		postData.ambnum    	= Utils.formatValue(req.body.ambnum);
        
        var dbEngine = new DBEng(req.session, connectionPool);
        res.send(await dbEngine.uncontrolledChangeData('update_patient', postData));
    } else {
        res.send('ERROR_ACCESS_DENIED');
    }
});
//insert patient
dCardRouter.post('/insert_patient', async function(req, res, next){
    //1 -- for main-inspector usage | 3 -- for inspector usage
    if (Utils.checkPermission(req.session, 1) || Utils.checkPermission(req.session, 3)) {
        var postData = {};       
		postData.fio		= Utils.formatValue(req.body.fio);
		postData.birthdate	= (Utils.formatValue(req.body.birthdate) !== null ? Utils.dateConvert(req.body.birthdate,'BACK_END') : null);
        postData.height		= Utils.formatValue(req.body.height);
		postData.ambnum    	= Utils.formatValue(req.body.ambnum);
        
        var dbEngine = new DBEng(req.session, connectionPool);
        res.send(await dbEngine.uncontrolledChangeData('insert_patient', postData));
    } else {
        res.send('ERROR_ACCESS_DENIED');
    }
});
//select patient by ID
dCardRouter.post('/select_patient_by_id', async function(req, res, next){
    //1 -- for main-inspector usage | 3 -- for inspector usage
    if (Utils.checkPermission(req.session, 1) || Utils.checkPermission(req.session, 3)) {
        var dbEngine = new DBEng(req.session, connectionPool);
        res.send(await dbEngine.selectDataByID('select_patient_by_id', parseInt(req.body.id)));
    } else {
        res.send('ERROR_ACCESS_DENIED');
    }
});
//insert dcard
dCardRouter.post('/insert_dcard', async function(req, res, next){
    //1 -- for main-inspector usage | 3 -- for inspector usage
    if (Utils.checkPermission(req.session, 1) || Utils.checkPermission(req.session, 3)) {
        var postData = {};       
		postData.patientid 	  = parseInt(req.body.patientid);
		postData.date		  = (Utils.formatValue(req.body.date) !== null ? Utils.dateConvert(req.body.date,'BACK_END') : null);
        postData.dprocedureid = parseInt(req.body.dprocedureid);
		postData.changelog 	  = Utils.formatValue(req.body.changelog);
        
        var dbEngine = new DBEng(req.session, connectionPool);
        res.send(await dbEngine.uncontrolledChangeData('insert_dcard', postData));
    } else {
        res.send('ERROR_ACCESS_DENIED');
    }
});
//select dcards
dCardRouter.post('/select_dcards', async function(req, res, next){
    //1 -- for main-inspector usage | 3 -- for inspector usage
    if (Utils.checkPermission(req.session, 1) || Utils.checkPermission(req.session, 3)) {
        var postData = {};
        postData.page = parseInt(req.body.page);
        postData.perPage = 25;
        postData.startPosition = postData.perPage * postData.page;
		
        postData.id				= Utils.createRegExp(req.body.id,'EQUALS');
		postData.patientid 		= Utils.createRegExp(req.body.patientid,'EQUALS');
        postData.date			= Utils.createRegExp(Utils.dateConvert(req.body.date,'BACK_END'),'EQUALS');
		postData.patientambnum 	= Utils.createRegExp(req.body.patientambnum,'STARTS_FROM');
		postData.patientfio		= Utils.createRegExp(req.body.patientfio,'STARTS_FROM');
		
        var dbEngine = new DBEng(req.session, connectionPool);
        res.send(await dbEngine.selectData('select_dcards', postData));
    } else {
        res.send('ERROR_ACCESS_DENIED');
    }
});
//validate dcards
dCardRouter.post('/validate_dcards', async function(req, res, next){
    //1 -- for main-inspector usage
    if (Utils.checkPermission(req.session, 1)) {
        var postData = {};
        postData.page = parseInt(req.body.page);
        postData.perPage = 25;
        postData.startPosition = postData.perPage * postData.page;
		
        var dbEngine = new DBEng(req.session, connectionPool);
        res.send(await dbEngine.selectData('validate_dcards', postData));
    } else {
        res.send('ERROR_ACCESS_DENIED');
    }
});
//select dcard by ID
dCardRouter.post('/select_dcard_by_id', async function(req, res, next){
    //1 -- for main-inspector usage | 3 -- for inspector usage
    if (Utils.checkPermission(req.session, 1) || Utils.checkPermission(req.session, 3)) {
        var dbEngine = new DBEng(req.session, connectionPool);
        res.send(await dbEngine.selectDataByID('select_dcard_by_id', parseInt(req.body.id)));
    } else {
        res.send('ERROR_ACCESS_DENIED');
    }
});
//update dcard
dCardRouter.post('/update_dcard', async function(req, res, next){
    //1 -- for main-inspector usage | 3 -- for inspector usage
    if (Utils.checkPermission(req.session, 1) || Utils.checkPermission(req.session, 3)) {
        var postData = {};

		postData.d_procedure_id 		= parseInt(req.body.d_procedure_id);
		postData.dry_weight 			= Utils.formatValue(req.body.dry_weight);
		postData.room 					= Utils.formatValue(req.body.room);
		postData.date 					= (Utils.formatValue(req.body.date) !== null ? Utils.dateConvert(req.body.date,'BACK_END') : null);
		postData.device_id 				= parseInt(req.body.device_id);
		postData.dialyzer_id 			= parseInt(req.body.dialyzer_id);
		postData.gd_period_minutes 		= Utils.formatValue(req.body.gd_period_minutes);
		postData.inject_speed 			= Utils.formatValue(req.body.inject_speed);
		postData.dialysate_id 			= parseInt(req.body.dialysate_id);
		postData.stream_dita 			= Utils.formatValue(req.body.stream_dita);
		postData.heparin_dose 			= Utils.formatValue(req.body.heparin_dose);
		postData.bolus 					= Utils.formatValue(req.body.bolus);
		postData.vr_heparin_complete 	= Utils.formatValue(req.body.vr_heparin_complete);
		postData.bicarbonate 			= Utils.formatValue(req.body.bicarbonate);
		postData.na 					= Utils.formatValue(req.body.na);
		postData.v_uf 					= Utils.formatValue(req.body.v_uf);
		postData.sk_k 					= Utils.formatValue(req.body.sk_k);
		postData.pre_weight 			= Utils.formatValue(req.body.pre_weight);
		postData.pre_ap_up 				= Utils.formatValue(req.body.pre_ap_up);
		postData.pre_ap_low 			= Utils.formatValue(req.body.pre_ap_low);
		postData.pre_pulse 				= Utils.formatValue(req.body.pre_pulse);
		postData.pre_complaint 			= parseInt(req.body.pre_complaint);
		postData.pre_edema 				= parseInt(req.body.pre_edema);
		postData.pre_state_id 			= parseInt(req.body.pre_state_id);
		postData.pre_breath_changes 	= parseInt(req.body.pre_breath_changes);
		postData.pre_wheeze 			= parseInt(req.body.pre_wheeze);
		postData.pre_wheeze_local 		= Utils.formatValue(req.body.pre_wheeze_local);
		postData.pre_heart_rhythm_id 	= parseInt(req.body.pre_heart_rhythm_id);
		postData.pre_stomach_soft_id 	= parseInt(req.body.pre_stomach_soft_id);
		postData.pre_stomach_pain_id 	= parseInt(req.body.pre_stomach_pain_id);
		postData.pre_stomach_pain_local = Utils.formatValue(req.body.pre_stomach_pain_local);
		postData.pre_area_avf_id 		= parseInt(req.body.pre_area_avf_id);
		postData.pre_noise_avf_id 		= parseInt(req.body.pre_noise_avf_id);
		postData.pre_additions 			= Utils.formatValue(req.body.pre_additions);
		postData.epoetin_alfa 			= Utils.formatValue(req.body.epoetin_alfa);
		postData.epoetin_beta 			= Utils.formatValue(req.body.epoetin_beta);
		postData.aranesp 				= Utils.formatValue(req.body.aranesp);
		postData.mircera 				= Utils.formatValue(req.body.mircera);
		postData.post_injection_id 		= parseInt(req.body.post_injection_id);
		postData.ferrum_dextran 		= Utils.formatValue(req.body.ferrum_dextran);
		postData.ferrum_sacch 			= Utils.formatValue(req.body.ferrum_sacch);
		postData.vit_c 					= Utils.formatValue(req.body.vit_c);
		postData.vit_b 					= parseInt(req.body.vit_b);
		postData.post_weight 			= Utils.formatValue(req.body.post_weight);
		postData.post_ap_up 			= Utils.formatValue(req.body.post_ap_up);
		postData.post_ap_low 			= Utils.formatValue(req.body.post_ap_low);
		postData.post_pulse 			= Utils.formatValue(req.body.post_pulse);
		postData.ktv 					= Utils.formatValue(req.body.ktv);
		postData.v_perf_blood 			= Utils.formatValue(req.body.v_perf_blood);
		postData.v_replacement 			= Utils.formatValue(req.body.v_replacement);
		postData.pre_glucose 			= Utils.formatValue(req.body.pre_glucose);
		postData.post_glucose 			= Utils.formatValue(req.body.post_glucose);
		postData.body_temp 				= Utils.formatValue(req.body.body_temp);
		postData.electrolyte_ca 		= Utils.formatValue(req.body.electrolyte_ca);
		postData.electrolyte_k 			= Utils.formatValue(req.body.electrolyte_k);
		postData.electrolyte_na		 	= Utils.formatValue(req.body.electrolyte_na);
		postData.ekg 					= Utils.formatValue(req.body.ekg);
		postData.post_complaint 		= parseInt(req.body.post_complaint);
		postData.post_state_id 			= parseInt(req.body.post_state_id);
		postData.post_gd_difficulties 	= parseInt(req.body.post_gd_difficulties);
		postData.post_change_required 	= parseInt(req.body.post_change_required);
		postData.post_additions 		= Utils.formatValue(req.body.post_additions);
		postData.id 					= parseInt(req.body.id);
		postData.changelog 				= Utils.formatValue(req.body.changelog);
        
        var dbEngine = new DBEng(req.session, connectionPool);
        res.send(await dbEngine.uncontrolledChangeData('update_dcard', postData));
    } else {
        res.send('ERROR_ACCESS_DENIED');
    }
});
//delete dcard
dCardRouter.post('/delete_dcard', async function(req, res, next){
    //1 -- for main-inspector usage | 3 -- for inspector usage
    if (Utils.checkPermission(req.session, 1) || Utils.checkPermission(req.session, 3)) {
        var postData = {};
        postData.id = parseInt(req.body.id);
		postData.changelog = Utils.formatValue(req.body.changelog);
        
        var dbEngine = new DBEng(req.session, connectionPool);
        res.send(await dbEngine.uncontrolledChangeData('delete_dcard', postData));
    } else {
        res.send('ERROR_ACCESS_DENIED');
    }
});
//print dcard by ID
dCardRouter.post('/print_dcard', async function(req, res, next){
    //1 -- for main-inspector usage | 3 -- for inspector usage
    if (Utils.checkPermission(req.session, 1) || Utils.checkPermission(req.session, 3)) {
        var dbEngine = new DBEng(req.session, connectionPool);
		var dcValues = await dbEngine.selectDataByID('select_dcard_by_id_print', parseInt(req.body.id));
		
		//Load the docx file as a binary
		if (parseInt(req.body.printtype) === 1) {
			var content = fs.readFileSync(path.resolve(__dirname, 'output1.docx'), 'binary');
		} else if (parseInt(req.body.printtype) === 2) {
			var content = fs.readFileSync(path.resolve(__dirname, 'output2.docx'), 'binary');
		} else {
			var content = fs.readFileSync(path.resolve(__dirname, 'output.docx'), 'binary');
		}
		
		var zip = new JSZip(content);

		var doc = new Docxtemplater();
		doc.loadZip(zip);
		
		doc.setData({
			d0: dcValues.fields.d0,
			d1: dcValues.fields.d1,
			d2: dcValues.fields.d2,
			d3: dcValues.fields.d3,
			d4: dcValues.fields.d4,
			d5: dcValues.fields.d5,
			d6: dcValues.fields.d6,
			d7: dcValues.fields.d7,
			d8: dcValues.fields.d8,
			d9: dcValues.fields.d9,
			d10: dcValues.fields.d10,
			d11: dcValues.fields.d11,
			d12: dcValues.fields.d12,
			d13: dcValues.fields.d13,
			d14: dcValues.fields.d14,
			d15: dcValues.fields.d15,
			d16: dcValues.fields.d16,
			d17: dcValues.fields.d17,
			d18: dcValues.fields.d18,
			d19: dcValues.fields.d19,
			d20: dcValues.fields.d20,
			d21: dcValues.fields.d21a +' / '+ dcValues.fields.d21b,
			d22: dcValues.fields.d22,
			d23: (dcValues.fields.d23 === 0 ? 'нет' : 'есть'),
			d24: (dcValues.fields.d24 === 0 ? 'нет' : 'есть'),
			d25: dcValues.fields.d25,
			d26: (dcValues.fields.d26 === 0 ? 'нет' : 'есть'),
			d27: (dcValues.fields.d27 === 0 ? 'нет' : 'есть'),
			d28: dcValues.fields.d28,
			d29: dcValues.fields.d29,
			d30: dcValues.fields.d30,
			d31: dcValues.fields.d31,
			d32: dcValues.fields.d32,
			d33: dcValues.fields.d33,
			d34: dcValues.fields.d34,
			d35: dcValues.fields.d35,
			d36: dcValues.fields.d36,
			d37: dcValues.fields.d37,
			d38: dcValues.fields.d38,
			d39: dcValues.fields.d39,
			d40: dcValues.fields.d40,
			d41: dcValues.fields.d41,
			d42: dcValues.fields.d42,
			d43: dcValues.fields.d43,
			d44: (dcValues.fields.d44 === 0 ? 'нет' : 'да'),
			d45: dcValues.fields.d45,
			d46: dcValues.fields.d46,
			d47: dcValues.fields.d47a +' / '+ dcValues.fields.d47b,
			d48: dcValues.fields.d48,
			d49: dcValues.fields.d49,
			d50: dcValues.fields.d50,
			d51: dcValues.fields.d51,
			d52: dcValues.fields.d52,
			d53: dcValues.fields.d53,
			d54: dcValues.fields.d54,
			d55: dcValues.fields.d55,
			d56: dcValues.fields.d56,
			d57: dcValues.fields.d57,
			d58: dcValues.fields.d58,
			d59: (dcValues.fields.d59 === 0 ? 'нет' : 'есть'),
			d60: dcValues.fields.d60,
			d61: (dcValues.fields.d61 === 0 ? 'нет' : 'есть'),
			d62: (dcValues.fields.d62 === 0 ? 'нет' : 'требуется'),
			d63: dcValues.fields.d63,
			d64: dcValues.fields.d64
		});
		
		try {
			// render the document (replace all occurences of {some_param}, {@some_param}
			doc.render()
		}
		catch (error) {
			
			var e = {
				message: error.message,
				name: error.name,
				stack: error.stack,
				properties: error.properties,
			}
			console.log(JSON.stringify({error: e}));
			// The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
			throw error;
			
			/*
			error.properties.errors.forEach(function(err) {
				console.log(err);
			});
			*/
		}
		
		var buf = doc.getZip().generate({type: 'nodebuffer'});

		res.writeHead(200, {
			'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
			'Content-disposition': 'attachment;filename="' + 'output' + '.docx"',
			'Content-Length': buf.length
		});
		res.end(new Buffer(buf, 'binary'));
    } else {
        res.send('ERROR_ACCESS_DENIED');
    }
});
//

module.exports = dCardRouter;
