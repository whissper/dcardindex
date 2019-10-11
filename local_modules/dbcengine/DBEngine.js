var mysql        = require('mysql');
var QueryEng     = require('./QueryEngine');
var CryptEng     = require('../utils/CryptEngine');
var Utils        = require('../utils/Utils');
var SQLException = require('./SQLException');

/**
 * DBEngine class
 */
class DBEngine {
    
    constructor(session, poolInstance) {
        this.session = session;
        this.pool    = poolInstance;
    }
    
    /**
     * select Login data
     * @param {String} login
     * @param {String} password
     * @returns {object} {id, role, fio, depid, depname} OR {error}
     */
    async selectLoginData(login, password) {
        var params = [];
        params.push(login);

        var rows = {};

        var queryString = 
        'SELECT users.id, '+
               'users.fio, '+
               'users.login, '+
               'users.pass, '+
               'users.role '+
        'FROM users '+ 
        'WHERE users.login = ? '+  
        'ORDER BY users.id DESC';
        
        await new QueryEng(this.pool).query(mysql.format(queryString, params))
            .then(
                (result) => {
                    if (result.length > 0) {
                        if (CryptEng.passVerify(password ,result[0].pass)) {
                            rows.id             = result[0].id;
                            rows.role           = result[0].role;
                            rows.fio            = result[0].fio;
                        }
                    }
                }, 
                (error) => {
                    rows.error = 'ERROR_PDO|' + error.sqlMessage;
                }
            );

        return rows;
    }
	
	/**
     * SELECT some data
     * @param {String} queryName - query string
     * @param {object} postData - post Data
     * @returns {String} JSON
     */
    async selectData(queryName, postData) {
        var resultString     = {};
        
        var queryStringCount = '';
        var queryString      = '';
        var params           = [];
        var dataColumns      = [];
        
        var resultSet        = null;
        
        switch (queryName) {
            case 'select_users':
                queryStringCount = 
                    'SELECT COUNT(users.id) AS "countrows" '+
                    'FROM users '+
                    'WHERE users.fio REGEXP ?';
            
                queryString = 
                    'SELECT users.id, users.fio, users.locked '+
                    'FROM users '+
                    'WHERE users.fio REGEXP ? '+
                    'ORDER BY users.fio ASC '+
                    'LIMIT ' + postData.startPosition + ', ' + postData.perPage;
            
                params.push(postData.userfio);
                
                dataColumns.push(
                    'id',
                    'locked',
                    'fio'
                );
                break;
			case 'select_patients':
				queryStringCount = 
                    'SELECT COUNT(patients.id) AS "countrows" '+
                    'FROM patients '+
                    'WHERE patients.id REGEXP ? AND '+
						  'patients.fio REGEXP ? AND '+
						  '(patients.ambulance_num REGEXP ? OR patients.ambulance_num IS NULL) AND '+
						  '(patients.birthdate REGEXP ? OR patients.birthdate IS NULL)';
						  
				queryString =
					'SELECT patients.id, patients.fio, patients.ambulance_num, patients.birthdate, patients.height '+
                    'FROM patients '+
                    'WHERE patients.id REGEXP ? AND '+
						  'patients.fio REGEXP ? AND '+
						  '(patients.ambulance_num REGEXP ? OR patients.ambulance_num IS NULL) AND '+
						  '(patients.birthdate REGEXP ? OR patients.birthdate IS NULL) '+
					'ORDER BY patients.fio ASC '+
                    'LIMIT ' + postData.startPosition + ', ' + postData.perPage;
					
				params.push(postData.id);
				params.push(postData.fio);
				params.push(postData.ambnum);
				params.push(postData.birthdate);
				
				dataColumns.push(
					'id',
					'fio',
					'birthdate',
					'height',
					'ambulance_num'
				);
				break;
			case 'select_dcards':
				queryStringCount =
					'SELECT COUNT(dialysis_cards.id) AS "countrows" '+
					'FROM dialysis_cards '+
					'LEFT JOIN patients ON dialysis_cards.patient_id = patients.id '+
					'WHERE dialysis_cards.deleted = 0 AND '+
						  'dialysis_cards.id REGEXP ? AND '+
						  'dialysis_cards.date REGEXP ? AND '+
						  'patients.id REGEXP ? AND '+
						  'patients.fio REGEXP ? AND '+
						  '(patients.ambulance_num REGEXP ? OR patients.ambulance_num IS NULL)';
				
				queryString =
					'SELECT '+ 
						'dialysis_cards.id, '+ 
						'dialysis_cards.date, '+ 
						'patients.id AS "patientid", '+ 
						'patients.fio, '+
						'patients.ambulance_num '+
					'FROM dialysis_cards '+
					'LEFT JOIN patients ON dialysis_cards.patient_id = patients.id '+
					'WHERE dialysis_cards.deleted = 0 AND '+
						  'dialysis_cards.id REGEXP ? AND '+
						  'dialysis_cards.date REGEXP ? AND '+
						  'patients.id REGEXP ? AND '+
						  'patients.fio REGEXP ? AND '+
						  '(patients.ambulance_num REGEXP ? OR patients.ambulance_num IS NULL) '+
					'ORDER BY dialysis_cards.id DESC '+
					'LIMIT ' + postData.startPosition + ', ' + postData.perPage;
					
				params.push(postData.id);
				params.push(postData.date);
				params.push(postData.patientid);
				params.push(postData.patientfio);
				params.push(postData.patientambnum);
				
				dataColumns.push(
					'id',
					'date',
					'patientid',
					'fio',
					'ambulance_num'
				);
				break;
			case 'validate_dcards':
				queryStringCount =
					'SELECT '+
						'COUNT(dialysis_cards.id) AS "countrows" '+ 
					'FROM dialysis_cards '+
					'WHERE dialysis_cards.deleted = 0 AND '+
						'( dialysis_cards.dry_weight IS NULL OR '+
						'dialysis_cards.room IS NULL OR '+
						'dialysis_cards.date IS NULL OR '+
						'dialysis_cards.gd_period_minutes IS NULL OR '+
						'dialysis_cards.inject_speed IS NULL OR '+
						'dialysis_cards.stream_dita IS NULL OR '+
						'dialysis_cards.heparin_dose IS NULL OR '+
						'dialysis_cards.bolus IS NULL OR '+
						'dialysis_cards.vr_heparin_complete IS NULL OR '+
						'dialysis_cards.bicarbonate IS NULL OR '+
						'dialysis_cards.na IS NULL OR '+
						'dialysis_cards.v_uf IS NULL OR '+
						'dialysis_cards.sk_k IS NULL OR '+
						'dialysis_cards.pre_weight IS NULL OR '+
						'dialysis_cards.pre_ap_up IS NULL OR '+
						'dialysis_cards.pre_ap_low IS NULL OR '+
						'dialysis_cards.pre_pulse IS NULL OR '+
						'dialysis_cards.post_weight IS NULL OR '+
						'dialysis_cards.post_ap_up IS NULL OR '+
						'dialysis_cards.post_ap_low IS NULL OR '+
						'dialysis_cards.post_pulse IS NULL OR '+
						'dialysis_cards.ktv IS NULL OR '+
						'dialysis_cards.v_perf_blood IS NULL )';
				
				queryString =
					'SELECT '+
						'dialysis_cards.id, '+ 
						'dialysis_cards.date, '+ 
						'patients.id AS "patientid", '+ 
						'patients.fio, '+
						'patients.ambulance_num, '+ // <-------- table columns						
						'dialysis_cards.dry_weight, '+
						'dialysis_cards.room, '+
						'dialysis_cards.date, '+
						'dialysis_cards.gd_period_minutes, '+
						'dialysis_cards.inject_speed, '+
						'dialysis_cards.stream_dita, '+
						'dialysis_cards.heparin_dose, '+
						'dialysis_cards.bolus, '+
						'dialysis_cards.vr_heparin_complete, '+
						'dialysis_cards.bicarbonate, '+
						'dialysis_cards.na, '+
						'dialysis_cards.v_uf, '+
						'dialysis_cards.sk_k, '+
						'dialysis_cards.pre_weight, '+
						'dialysis_cards.pre_ap_up, '+
						'dialysis_cards.pre_ap_low, '+
						'dialysis_cards.pre_pulse, '+
						'dialysis_cards.post_weight, '+
						'dialysis_cards.post_ap_up, '+
						'dialysis_cards.post_ap_low, '+
						'dialysis_cards.post_pulse, '+
						'dialysis_cards.ktv, '+
						'dialysis_cards.v_perf_blood '+
					'FROM dialysis_cards '+
					'LEFT JOIN patients ON dialysis_cards.patient_id = patients.id '+
					'WHERE dialysis_cards.deleted = 0 AND '+
						'( dialysis_cards.dry_weight IS NULL OR '+
						'dialysis_cards.room IS NULL OR '+
						'dialysis_cards.date IS NULL OR '+
						'dialysis_cards.gd_period_minutes IS NULL OR '+
						'dialysis_cards.inject_speed IS NULL OR '+
						'dialysis_cards.stream_dita IS NULL OR '+
						'dialysis_cards.heparin_dose IS NULL OR '+
						'dialysis_cards.bolus IS NULL OR '+
						'dialysis_cards.vr_heparin_complete IS NULL OR '+
						'dialysis_cards.bicarbonate IS NULL OR '+
						'dialysis_cards.na IS NULL OR '+
						'dialysis_cards.v_uf IS NULL OR '+
						'dialysis_cards.sk_k IS NULL OR '+
						'dialysis_cards.pre_weight IS NULL OR '+
						'dialysis_cards.pre_ap_up IS NULL OR '+
						'dialysis_cards.pre_ap_low IS NULL OR '+
						'dialysis_cards.pre_pulse IS NULL OR '+
						'dialysis_cards.post_weight IS NULL OR '+
						'dialysis_cards.post_ap_up IS NULL OR '+
						'dialysis_cards.post_ap_low IS NULL OR '+
						'dialysis_cards.post_pulse IS NULL OR '+
						'dialysis_cards.ktv IS NULL OR '+
						'dialysis_cards.v_perf_blood IS NULL ) '+
					'ORDER BY dialysis_cards.id DESC '+
					'LIMIT ' + postData.startPosition + ', ' + postData.perPage;
					
				dataColumns.push(
					'id',
					'date',
					'patientid',
					'fio',
					'ambulance_num',
					'dry_weight',
					'room',
					'date',
					'gd_period_minutes',
					'inject_speed',
					'stream_dita',
					'heparin_dose',
					'bolus',
					'vr_heparin_complete',
					'bicarbonate',
					'na',
					'v_uf',
					'sk_k',
					'pre_weight',
					'pre_ap_up',
					'pre_ap_low',
					'pre_pulse',
					'post_weight',
					'post_ap_up',
					'post_ap_low',
					'post_pulse',
					'ktv',
					'v_perf_blood'
				);
				break;
        }
        
        try {
            await new QueryEng(this.pool).query(mysql.format(queryStringCount, params))
                .then(
                    (result) => {
                        resultString.countrows = result[0].countrows;
                        resultString.page      = postData.page;
                        resultString.perpage   = postData.perPage;
                        resultString.rowitems  = [];
                    },
                    (error) => {
                        throw new SQLException('SQL Exception', error.sqlMessage);
                    }
                );
            
            await new QueryEng(this.pool).query(mysql.format(queryString, params))
                .then(
                    (result) => {
                        resultSet = result;
                    },
                    (error) => {
                        throw new SQLException('SQL Exception', error.sqlMessage);
                    }
                );
            
            for (var item of resultSet) {
                var itemToPlace = [];
                for (var prop of dataColumns) {
                    
					if (prop === 'birthdate') {
						var birthdateStr = (item[prop] !== null ? Utils.dateConvert(item[prop].toISOString(),'FRONT_END') : null);
						itemToPlace.push( Utils.nullToStr(birthdateStr));
					} else if (prop === 'date') {
						var dateStr = (item[prop] !== null ? Utils.dateConvert(item[prop].toISOString(),'FRONT_END') : null);
						itemToPlace.push( Utils.nullToStr(dateStr));
					} else {
						itemToPlace.push(Utils.nullToStr( item[prop] ));
					}
					
                }

                resultString.rowitems.push(itemToPlace);
            }
        } catch (e) {
            resultString = 'ERROR_PDO|' + e.error;
        }

        return resultString;    
    }
	
	/**
     * SELECT some data BY ID
     * @param {type} queryName
     * @param {type} id
     * @returns {String} JSON
     */
    async selectDataByID(queryName, id) {
        var resultString  = {};
        
        var queryString   = '';
        var params        = [];
        var entityName    = '';
        var mapping       = null;
        
        var resultSet     = null;
        
        params.push(id);
        
        switch (queryName) {
            case 'select_user_by_id':
                queryString = 
                    'SELECT users.id, '+
                           'users.fio, '+
                           'users.login, '+
                           'users.locked, '+
                           'users.first_login AS "firstlogin" '+
                    'FROM users '+
                    'WHERE users.id = ?';
            
                entityName = 'user';
                
                mapping = {
                    idUpd:                 'id',
                    fioUserUpd:            'fio',
                    loginUserUpd:          'login',
                    lockedUserUpd:         'locked',
                    firstloginUserUpd:     'firstlogin'
                };
                break;
			case 'select_patient_by_id':
				queryString =
					'SELECT patients.id, '+
						   'patients.fio, '+
						   'patients.ambulance_num, '+
						   'patients.birthdate, '+
						   'patients.height '+
					'FROM patients '+
					'WHERE patients.id = ? ';
				
				entityName = 'patient';
				
				mapping = {
					idUpd				: 'id',
					patientFioUpd		: 'fio',
					patientBirthdateUpd : 'birthdate',
					patientHeightUpd	: 'height',
					patientAmbnumUpd	: 'ambulance_num'
				};
				break;
			case 'select_dcard_by_id':
				queryString =
					'SELECT '+
						'dialysis_cards.id AS "dcardid", '+
						'dialysis_cards.patient_id AS "dpatientid", '+
						'dialysis_cards.d_procedure_id AS "d0", '+
						'patients.fio AS "d1", '+
						'dialysis_cards.dry_weight AS "d2", '+
						'patients.height AS "d3", '+
						'TIMESTAMPDIFF(YEAR, patients.birthdate, CURDATE()) AS "d4", '+
						'dialysis_cards.room AS "d5", '+
						'dialysis_cards.date AS "d6", '+
						'dialysis_cards.device_id AS "d7", '+
						'dialysis_cards.dialyzer_id AS "d8", '+
						'dialysis_cards.gd_period_minutes AS "d9", '+
						'dialysis_cards.inject_speed AS "d10", '+
						'dialysis_cards.dialysate_id AS "d11", '+
						'dialysis_cards.stream_dita AS "d12", '+
						'dialysis_cards.heparin_dose AS "d13", '+
						'dialysis_cards.bolus AS "d14", '+
						'dialysis_cards.vr_heparin_complete AS "d15", '+
						'dialysis_cards.bicarbonate AS "d16", '+
						'dialysis_cards.na AS "d17", '+
						'dialysis_cards.v_uf AS "d18", '+
						'dialysis_cards.sk_k AS "d19", '+
						'dialysis_cards.pre_weight AS "d20", '+
						'dialysis_cards.pre_ap_up AS "d21a", '+
						'dialysis_cards.pre_ap_low AS "d21b", '+
						'dialysis_cards.pre_pulse AS "d22", '+
						'dialysis_cards.pre_complaint AS "d23", '+
						'dialysis_cards.pre_edema AS "d24", '+
						'dialysis_cards.pre_state_id AS "d25", '+
						'dialysis_cards.pre_breath_changes AS "d26", '+
						'dialysis_cards.pre_wheeze AS "d27", '+
						'dialysis_cards.pre_wheeze_local AS "d28", '+
						'dialysis_cards.pre_heart_rhythm_id AS "d29", '+
						'dialysis_cards.pre_stomach_soft_id AS "d30", '+
						'dialysis_cards.pre_stomach_pain_id AS "d31", '+
						'dialysis_cards.pre_stomach_pain_local AS "d32", '+
						'dialysis_cards.pre_area_avf_id AS "d33", '+
						'dialysis_cards.pre_noise_avf_id AS "d34", '+
						'dialysis_cards.pre_additions AS "d35", '+
						'dialysis_cards.epoetin_alfa AS "d36", '+
						'dialysis_cards.epoetin_beta AS "d37", '+
						'dialysis_cards.aranesp AS "d38", '+
						'dialysis_cards.mircera AS "d39", '+
						'dialysis_cards.post_injection_id AS "d40", '+
						'dialysis_cards.ferrum_dextran AS "d41", '+
						'dialysis_cards.ferrum_sacch AS "d42", '+
						'dialysis_cards.vit_c AS "d43", '+
						'dialysis_cards.vit_b AS "d44", '+
						'dialysis_cards.post_weight AS "d45", '+
						'(IF(dialysis_cards.pre_weight IS NULL OR dialysis_cards.post_weight IS NULL, NULL, dialysis_cards.pre_weight - dialysis_cards.post_weight)) AS "d46", '+
						'dialysis_cards.post_ap_up AS "d47a", '+
						'dialysis_cards.post_ap_low AS "d47b", '+
						'dialysis_cards.post_pulse AS "d48", '+
						'dialysis_cards.ktv AS "d49", '+
						'dialysis_cards.v_perf_blood AS "d50", '+
						'dialysis_cards.v_replacement AS "d51", '+
						'dialysis_cards.pre_glucose AS "d52", '+
						'dialysis_cards.post_glucose AS "d53", '+
						'dialysis_cards.body_temp AS "d54", '+
						'dialysis_cards.electrolyte_ca AS "d55", '+
						'dialysis_cards.electrolyte_k AS "d56", '+
						'dialysis_cards.electrolyte_na AS "d57", '+
						'dialysis_cards.ekg AS "d58", '+
						'dialysis_cards.post_complaint AS "d59", '+
						'dialysis_cards.post_state_id AS "d60", '+
						'dialysis_cards.post_gd_difficulties AS "d61", '+
						'dialysis_cards.post_change_required AS "d62", '+
						'dialysis_cards.post_additions AS "d63", '+
						'(IF(dialysis_cards.pre_weight IS NULL OR dialysis_cards.dry_weight IS NULL, NULL, (dialysis_cards.pre_weight - dialysis_cards.dry_weight)*1000)) AS "d64", '+
						'(dialysis_cards.dry_weight - t.dry_weight) AS "dwdynamic", '+
						'CONCAT(dialysis_cards.dry_weight,"_","(",DATE_FORMAT(dialysis_cards.date, "%d.%m.%Y"),")"," -- ",t.dry_weight,"_","(",DATE_FORMAT(t.date, "%d.%m.%Y"),")") AS "dwdynamicdetails" '+
					'FROM '+
						'dialysis_cards '+
						'LEFT JOIN patients ON dialysis_cards.patient_id = patients.id '+
						'JOIN dialysis_cards AS t '+
							'ON t.patient_id = dialysis_cards.patient_id AND '+
							'( t.date BETWEEN (last_day(dialysis_cards.date - interval 1 month) + interval 1 day) AND (last_day(dialysis_cards.date)) ) AND '+
							't.deleted = 0 '+
					'WHERE '+
						'dialysis_cards.id = ? '+
					'ORDER BY t.date ASC '+
					'LIMIT 1';
				
				entityName = 'dcard';
				
				mapping = {
					d0 : 'd0',
					d1 : 'd1',
					d2 : 'd2',
					d3 : 'd3',
					d4 : 'd4',
					d5 : 'd5',
					d6 : 'd6',
					d7 : 'd7',
					d8 : 'd8',
					d9 : 'd9',
					d10 : 'd10',
					d11 : 'd11',
					d12 : 'd12',
					d13 : 'd13',
					d14 : 'd14',
					d15 : 'd15',
					d16 : 'd16',
					d17 : 'd17',
					d18 : 'd18',
					d19 : 'd19',
					d20 : 'd20',
					d21a : 'd21a',
					d21b : 'd21b',
					d22 : 'd22',
					d23 : 'd23',
					d24 : 'd24',
					d25 : 'd25',
					d26 : 'd26',
					d27 : 'd27',
					d28 : 'd28',
					d29 : 'd29',
					d30 : 'd30',
					d31 : 'd31',
					d32 : 'd32',
					d33 : 'd33',
					d34 : 'd34',
					d35 : 'd35',
					d36 : 'd36',
					d37 : 'd37',
					d38 : 'd38',
					d39 : 'd39',
					d40 : 'd40',
					d41 : 'd41',
					d42 : 'd42',
					d43 : 'd43',
					d44 : 'd44',
					d45 : 'd45',
					d46 : 'd46',
					d47a : 'd47a',
					d47b : 'd47b',
					d48 : 'd48',
					d49 : 'd49',
					d50 : 'd50',
					d51 : 'd51',
					d52 : 'd52',
					d53 : 'd53',
					d54 : 'd54',
					d55 : 'd55',
					d56 : 'd56',
					d57 : 'd57',
					d58 : 'd58',
					d59 : 'd59',
					d60 : 'd60',
					d61 : 'd61',
					d62 : 'd62',
					d63 : 'd63',
					d64 : 'd64',
					dcardid : 'dcardid',
					dpatientid : 'dpatientid',
					dwdynamic : 'dwdynamic',
					dwdynamicdetails : 'dwdynamicdetails'
				};
				break;
			case 'select_dcard_by_id_print':
				queryString =
					'SELECT '+
						'dialysis_cards.id AS "dcardid", '+
						'dialysis_cards.patient_id AS "dpatientid", '+
						'd_procedures.name AS "d0", '+
						'patients.fio AS "d1", '+
						'dialysis_cards.dry_weight AS "d2", '+
						'patients.height AS "d3", '+
						'TIMESTAMPDIFF(YEAR, patients.birthdate, CURDATE()) AS "d4", '+
						'dialysis_cards.room AS "d5", '+
						'dialysis_cards.date AS "d6", '+
						'devices.name AS "d7", '+
						'dialyzers.name AS "d8", '+
						'dialysis_cards.gd_period_minutes AS "d9", '+
						'dialysis_cards.inject_speed AS "d10", '+
						'dialysates.name AS "d11", '+
						'dialysis_cards.stream_dita AS "d12", '+
						'dialysis_cards.heparin_dose AS "d13", '+
						'dialysis_cards.bolus AS "d14", '+
						'dialysis_cards.vr_heparin_complete AS "d15", '+
						'dialysis_cards.bicarbonate AS "d16", '+
						'dialysis_cards.na AS "d17", '+
						'dialysis_cards.v_uf AS "d18", '+
						'dialysis_cards.sk_k AS "d19", '+
						'dialysis_cards.pre_weight AS "d20", '+
						'dialysis_cards.pre_ap_up AS "d21a", '+
						'dialysis_cards.pre_ap_low AS "d21b", '+
						'dialysis_cards.pre_pulse AS "d22", '+
						'dialysis_cards.pre_complaint AS "d23", '+
						'dialysis_cards.pre_edema AS "d24", '+
						'pre_state.name AS "d25", '+
						'dialysis_cards.pre_breath_changes AS "d26", '+
						'dialysis_cards.pre_wheeze AS "d27", '+
						'dialysis_cards.pre_wheeze_local AS "d28", '+
						'heart_rhythm.name AS "d29", '+
						'stomach_soft.name AS "d30", '+
						'stomach_pain.name AS "d31", '+
						'dialysis_cards.pre_stomach_pain_local AS "d32", '+
						'area_avf.name AS "d33", '+
						'noise_avf.name AS "d34", '+
						'dialysis_cards.pre_additions AS "d35", '+
						'dialysis_cards.epoetin_alfa AS "d36", '+
						'dialysis_cards.epoetin_beta AS "d37", '+
						'dialysis_cards.aranesp AS "d38", '+
						'dialysis_cards.mircera AS "d39", '+
						'injection_types.name AS "d40", '+
						'dialysis_cards.ferrum_dextran AS "d41", '+
						'dialysis_cards.ferrum_sacch AS "d42", '+
						'dialysis_cards.vit_c AS "d43", '+
						'dialysis_cards.vit_b AS "d44", '+
						'dialysis_cards.post_weight AS "d45", '+
						'(IF(dialysis_cards.pre_weight IS NULL OR dialysis_cards.post_weight IS NULL, NULL, dialysis_cards.pre_weight - dialysis_cards.post_weight)) AS "d46", '+
						'dialysis_cards.post_ap_up AS "d47a", '+
						'dialysis_cards.post_ap_low AS "d47b", '+
						'dialysis_cards.post_pulse AS "d48", '+
						'dialysis_cards.ktv AS "d49", '+
						'dialysis_cards.v_perf_blood AS "d50", '+
						'dialysis_cards.v_replacement AS "d51", '+
						'dialysis_cards.pre_glucose AS "d52", '+
						'dialysis_cards.post_glucose AS "d53", '+
						'dialysis_cards.body_temp AS "d54", '+
						'dialysis_cards.electrolyte_ca AS "d55", '+
						'dialysis_cards.electrolyte_k AS "d56", '+
						'dialysis_cards.electrolyte_na AS "d57", '+
						'dialysis_cards.ekg AS "d58", '+
						'dialysis_cards.post_complaint AS "d59", '+
						'post_state.name AS "d60", '+
						'dialysis_cards.post_gd_difficulties AS "d61", '+
						'dialysis_cards.post_change_required AS "d62", '+
						'dialysis_cards.post_additions AS "d63", '+
						'(IF(dialysis_cards.pre_weight IS NULL OR dialysis_cards.dry_weight IS NULL, NULL, (dialysis_cards.pre_weight - dialysis_cards.dry_weight)*1000)) AS "d64" '+
					'FROM '+
						'dialysis_cards '+
						'LEFT JOIN patients ON dialysis_cards.patient_id = patients.id '+
						'LEFT JOIN d_procedures ON dialysis_cards.d_procedure_id = d_procedures.id '+
						'LEFT JOIN devices ON dialysis_cards.device_id = devices.id '+
						'LEFT JOIN dialyzers ON dialysis_cards.dialyzer_id = dialyzers.id '+
						'LEFT JOIN dialysates ON dialysis_cards.dialysate_id = dialysates.id '+
						'LEFT JOIN patient_state AS pre_state ON dialysis_cards.pre_state_id = pre_state.id '+
						'LEFT JOIN heart_rhythm ON dialysis_cards.pre_heart_rhythm_id = heart_rhythm.id '+
						'LEFT JOIN stomach_soft ON dialysis_cards.pre_stomach_soft_id = stomach_soft.id '+
						'LEFT JOIN stomach_pain ON dialysis_cards.pre_stomach_pain_id = stomach_pain.id '+
						'LEFT JOIN area_avf ON dialysis_cards.pre_area_avf_id = area_avf.id '+
						'LEFT JOIN noise_avf ON dialysis_cards.pre_noise_avf_id = noise_avf.id '+
						'LEFT JOIN injection_types ON dialysis_cards.post_injection_id = injection_types.id '+
						'LEFT JOIN patient_state AS post_state ON dialysis_cards.post_state_id = post_state.id '+
					'WHERE '+
						'dialysis_cards.id = ?';
				
				entityName = 'dcard';
				
				mapping = {
					d0 : 'd0',
					d1 : 'd1',
					d2 : 'd2',
					d3 : 'd3',
					d4 : 'd4',
					d5 : 'd5',
					d6 : 'd6',
					d7 : 'd7',
					d8 : 'd8',
					d9 : 'd9',
					d10 : 'd10',
					d11 : 'd11',
					d12 : 'd12',
					d13 : 'd13',
					d14 : 'd14',
					d15 : 'd15',
					d16 : 'd16',
					d17 : 'd17',
					d18 : 'd18',
					d19 : 'd19',
					d20 : 'd20',
					d21a : 'd21a',
					d21b : 'd21b',
					d22 : 'd22',
					d23 : 'd23',
					d24 : 'd24',
					d25 : 'd25',
					d26 : 'd26',
					d27 : 'd27',
					d28 : 'd28',
					d29 : 'd29',
					d30 : 'd30',
					d31 : 'd31',
					d32 : 'd32',
					d33 : 'd33',
					d34 : 'd34',
					d35 : 'd35',
					d36 : 'd36',
					d37 : 'd37',
					d38 : 'd38',
					d39 : 'd39',
					d40 : 'd40',
					d41 : 'd41',
					d42 : 'd42',
					d43 : 'd43',
					d44 : 'd44',
					d45 : 'd45',
					d46 : 'd46',
					d47a : 'd47a',
					d47b : 'd47b',
					d48 : 'd48',
					d49 : 'd49',
					d50 : 'd50',
					d51 : 'd51',
					d52 : 'd52',
					d53 : 'd53',
					d54 : 'd54',
					d55 : 'd55',
					d56 : 'd56',
					d57 : 'd57',
					d58 : 'd58',
					d59 : 'd59',
					d60 : 'd60',
					d61 : 'd61',
					d62 : 'd62',
					d63 : 'd63',
					d64 : 'd64',
					dcardid : 'dcardid',
					dpatientid : 'dpatientid'
				};
				break;
        }
        
        try {
            await new QueryEng(this.pool).query(mysql.format(queryString, params))
                .then(
                    (result) => {
                        resultSet = result;
                    },
                    (error) => {
                        throw new SQLException('SQL Exception', error.sqlMessage);
                    }
                );

            resultString.entity = entityName;
            resultString.fields = {};

            switch (entityName) {
                case 'exit':
					break;
				case 'patient':
					for (var prop in mapping) {
						if (mapping[prop] === 'birthdate') {
							var birthdateStr = (resultSet[0][mapping[prop]] !== null ? Utils.dateConvert(resultSet[0][mapping[prop]].toISOString(),'FRONT_END') : null);
							resultString.fields[prop] = Utils.nullToStr(birthdateStr);
						} else {
							resultString.fields[prop] = Utils.nullToStr( resultSet[0][mapping[prop]] );
						}
					}
					break;
				case 'dcard':
					for (var prop in mapping) {
						if (mapping[prop] === 'd6') {
							var dateStr = (resultSet[0][mapping[prop]] !== null ? Utils.dateConvert(resultSet[0][mapping[prop]].toISOString(),'FRONT_END') : null);
							resultString.fields[prop] = Utils.nullToStr(dateStr);
						} else {
							resultString.fields[prop] = Utils.nullToStr( resultSet[0][mapping[prop]] );
						}
					}
					break;
                default:
                    for (var prop in mapping) {
                        resultString.fields[prop] = Utils.nullToStr( resultSet[0][mapping[prop]] );
                    }
                    break;
            }
        } catch (e) {
            resultString = 'ERROR_PDO|' + e.error;
        }

        return resultString;
    }
	
	/**
     * UPDATE or DELETE
     * w\o checking current timestamp
     * @param {String} queryName
     * @param {object} postData
     * @returns {String} info string
     */
    async uncontrolledChangeData(queryName, postData) {
        var resultString = '';

        var queryString  = '';
        var params       = [];
        
        switch (queryName) {
            case 'lock_user':
                queryString = 
                    'UPDATE users '+
                    'SET locked = 1 '+
                    'WHERE users.id = ?';
            
                params.push(postData['id']);
                resultString = 'Пользователь с id: ' + postData['id'] + ' заблокирован.';
                break;
            case 'unlock_user':
                queryString = 
                    'UPDATE users '+
                    'SET locked = 0 '+
                    'WHERE users.id = ?';
            
                params.push(postData['id']);
                resultString = 'Пользователь с id: ' + postData['id'] + ' разблокирован.';
                break;
            case 'update_user':
                //if pass field is empty then don't change the password
                if (!postData['pass']) {
                    queryString = 
                        'UPDATE users '+
                        'SET fio = ?, login = ?, first_login = ? '+
                        'WHERE users.id = ?';
                
                    params.push(postData['fio']);
					params.push(postData['login']);
                    params.push(postData['firstlogin']);
                    params.push(postData['id']);
                //otherwise change the password as well
                } else {
					if (postData['login'] !== null) {
						queryString = 
							'UPDATE users '+
							'SET fio = ?, login = ?, pass = ?, first_login = ? '+
							'WHERE users.id = ?';
					
						params.push(postData['fio']);
						params.push(postData['login']);
						params.push(CryptEng.hashPass(postData['pass']));
						params.push(postData['firstlogin']);
						params.push(postData['id']);
					} else {
						queryString = 
							'UPDATE users '+
							'SET fio = ?, pass = ?, first_login = ? '+
							'WHERE users.id = ?';
					
						params.push(postData['fio']);
						params.push(CryptEng.hashPass(postData['pass']));
						params.push(postData['firstlogin']);
						params.push(postData['id']);
					}
                }
                
                resultString = 'Данные пользователя с id: ' + postData['id'] + ' успешно изменены.';
                break;
			case 'insert_user':
				queryString = 
					'INSERT INTO users (fio, login, pass, role) '+
					'VALUES (?, ?, ?, ?)';
				
				params.push(postData['fio']);
				params.push(postData['login']);
				params.push(CryptEng.hashPass(postData['pass']));
				params.push(postData['role']);
				
				resultString = 'Новый пользователь ' + postData['fio'] + ' успешно заведен в базу.';
				break;
			case 'update_patient':
				queryString = 
					'UPDATE patients '+
					'SET fio = ?, ambulance_num = ?, birthdate = ?, height = ? '+
					'WHERE patients.id = ?';
					
				params.push(postData['fio']);
				params.push(postData['ambnum']);
				params.push(postData['birthdate']);
				params.push(postData['height']);
				params.push(postData['id']);
				
				resultString = 'Данные пациента с id: ' + postData['id'] + ' успешно изменены.';
				break;
			case 'insert_patient':
				queryString = 
					'INSERT INTO patients (fio, ambulance_num, birthdate, height) '+
					'VALUES (?, ?, ?, ?)';
				
				params.push(postData['fio']);
				params.push(postData['ambnum']);
				params.push(postData['birthdate']);
				params.push(postData['height']);
				
				resultString = 'Новый пациент ' + postData['fio'] + ' успешно заведен в базу.';
				break;
			case 'insert_dcard':
				queryString =
					'INSERT INTO dialysis_cards (date, patient_id, d_procedure_id, changelog) '+
					'VALUES (?, ?, ?, ?)';
				
				params.push(postData['date']);
				params.push(postData['patientid']);
				params.push(postData['dprocedureid']);
				params.push(postData['changelog']);
				
				resultString = 'Диализная карта для пациента (id) ' + postData['patientid'] + ' с датой от ' + postData['date'] + ' успешно заведена в базу.';
				break;
			case 'update_dcard':
				queryString = 
					'UPDATE dialysis_cards '+
					'SET '+
						'd_procedure_id = ?, '+
						'dry_weight = ?, '+
						'room = ?, '+
						'date = ?, '+
						'device_id = ?, '+
						'dialyzer_id = ?, '+
						'gd_period_minutes = ?, '+
						'inject_speed = ?, '+
						'dialysate_id = ?, '+
						'stream_dita = ?, '+
						'heparin_dose = ?, '+
						'bolus = ?, '+
						'vr_heparin_complete = ?, '+
						'bicarbonate = ?, '+
						'na = ?, '+
						'v_uf = ?, '+
						'sk_k = ?, '+
						'pre_weight = ?, '+
						'pre_ap_up = ?, '+
						'pre_ap_low = ?, '+
						'pre_pulse = ?, '+
						'pre_complaint = ?, '+
						'pre_edema = ?, '+
						'pre_state_id = ?, '+
						'pre_breath_changes = ?, '+
						'pre_wheeze = ?, '+
						'pre_wheeze_local = ?, '+
						'pre_heart_rhythm_id = ?, '+
						'pre_stomach_soft_id = ?, '+
						'pre_stomach_pain_id = ?, '+
						'pre_stomach_pain_local = ?, '+
						'pre_area_avf_id = ?, '+
						'pre_noise_avf_id = ?, '+
						'pre_additions = ?, '+
						'epoetin_alfa = ?, '+
						'epoetin_beta = ?, '+
						'aranesp = ?, '+
						'mircera = ?, '+
						'post_injection_id = ?, '+
						'ferrum_dextran = ?, '+
						'ferrum_sacch = ?, '+
						'vit_c = ?, '+
						'vit_b = ?, '+
						'post_weight = ?, '+
						'post_ap_up = ?, '+
						'post_ap_low = ?, '+
						'post_pulse = ?, '+
						'ktv = ?, '+
						'v_perf_blood = ?, '+
						'v_replacement = ?, '+
						'pre_glucose = ?, '+
						'post_glucose = ?, '+
						'body_temp = ?, '+
						'electrolyte_ca = ?, '+
						'electrolyte_k = ?, '+
						'electrolyte_na = ?, '+
						'ekg = ?, '+
						'post_complaint = ?, '+
						'post_state_id = ?, '+
						'post_gd_difficulties = ?, '+
						'post_change_required = ?, '+
						'post_additions = ?, '+
						'changelog = CONCAT(changelog, ?) '+
					'WHERE dialysis_cards.id = ?';
				
				params.push(postData['d_procedure_id']);
				params.push(postData['dry_weight']);
				params.push(postData['room']);
				params.push(postData['date']);
				params.push(postData['device_id']);
				params.push(postData['dialyzer_id']);
				params.push(postData['gd_period_minutes']);
				params.push(postData['inject_speed']);
				params.push(postData['dialysate_id']);
				params.push(postData['stream_dita']);
				params.push(postData['heparin_dose']);
				params.push(postData['bolus']);
				params.push(postData['vr_heparin_complete']);
				params.push(postData['bicarbonate']);
				params.push(postData['na']);
				params.push(postData['v_uf']);
				params.push(postData['sk_k']);
				params.push(postData['pre_weight']);
				params.push(postData['pre_ap_up']);
				params.push(postData['pre_ap_low']);
				params.push(postData['pre_pulse']);
				params.push(postData['pre_complaint']);
				params.push(postData['pre_edema']);
				params.push(postData['pre_state_id']);
				params.push(postData['pre_breath_changes']);
				params.push(postData['pre_wheeze']);
				params.push(postData['pre_wheeze_local']);
				params.push(postData['pre_heart_rhythm_id']);
				params.push(postData['pre_stomach_soft_id']);
				params.push(postData['pre_stomach_pain_id']);
				params.push(postData['pre_stomach_pain_local']);
				params.push(postData['pre_area_avf_id']);
				params.push(postData['pre_noise_avf_id']);
				params.push(postData['pre_additions']);
				params.push(postData['epoetin_alfa']);
				params.push(postData['epoetin_beta']);
				params.push(postData['aranesp']);
				params.push(postData['mircera']);
				params.push(postData['post_injection_id']);
				params.push(postData['ferrum_dextran']);
				params.push(postData['ferrum_sacch']);
				params.push(postData['vit_c']);
				params.push(postData['vit_b']);
				params.push(postData['post_weight']);
				params.push(postData['post_ap_up']);
				params.push(postData['post_ap_low']);
				params.push(postData['post_pulse']);
				params.push(postData['ktv']);
				params.push(postData['v_perf_blood']);
				params.push(postData['v_replacement']);
				params.push(postData['pre_glucose']);
				params.push(postData['post_glucose']);
				params.push(postData['body_temp']);
				params.push(postData['electrolyte_ca']);
				params.push(postData['electrolyte_k']);
				params.push(postData['electrolyte_na']);
				params.push(postData['ekg']);
				params.push(postData['post_complaint']);
				params.push(postData['post_state_id']);
				params.push(postData['post_gd_difficulties']);
				params.push(postData['post_change_required']);
				params.push(postData['post_additions']);
				params.push(postData['changelog']);
				params.push(postData['id']);
				
				resultString = 'Данные по карте под номером id: ' + postData['id'] + ' записаны.';
				break;
			case 'delete_dcard':
				queryString = 
					'UPDATE dialysis_cards '+
					'SET deleted = 1, changelog = CONCAT(changelog, ?) '+
					'WHERE dialysis_cards.id = ?';
				
				params.push(postData['changelog']);
				params.push(postData['id']);
				resultString = 'Карта под номером id: ' + postData['id'] + ' успешно удалена.';
				break;
        }
        
        try {
            //special control for locking\unlocking users
            if (queryName === "lock_user" || queryName === "unlock_user") {
                //checking for possibility to change lock state
                if (await this.changeLockedStateIsPossible(postData['id'])) {
                    await new QueryEng(this.pool).query(mysql.format(queryString, params))
                        .then(
                            (result) => {

                            },
                            (error) => {
                                throw new SQLException('SQL Exception', error.sqlMessage);
                            }
                        );
                } else {
                    resultString = 'CHANGE_IMPOSSIBLE';
                }
            //for other "uncontrolled" changes
            } else {
                await new QueryEng(this.pool).query(mysql.format(queryString, params))
                    .then(
                        (result) => {

                        },
                        (error) => {
                            throw new SQLException('SQL Exception', error.sqlMessage);
                        }
                    );
            }
        } catch (e) {
            resultString = 'ERROR_PDO|' + e.error;
        }

        return resultString;
    }
	
	/**
     * private method
     * Check if user is trying to lock yourself
     * @param {int} userID
     * @returns {Boolean}
     */
    async changeLockedStateIsPossible(userID) {
        var isPossible = false;
        
        var queryString = 
            'SELECT * '+
            'FROM users '+
            'WHERE users.id = ?';
    
        var params = [];
        params.push(userID);
         
        try {
            await new QueryEng(this.pool).query(mysql.format(queryString, params))
                .then(
                    (result) => {
                        if (result.length > 0) {
                            if( result[0]['id'] === this.session.credentials.exitUsrId ) {
                                //if user is trying to lock yourself
                                isPossible = false;
                            } else {
                                isPossible = true;
                            }
                        }
                    },
                    (error) => {
                        throw new SQLException('SQL Exception', error.sqlMessage);
                    }
                );
        } catch(e) {

        }
        
        return isPossible;
    }
    
}

module.exports = DBEngine;
