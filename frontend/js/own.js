/**
 -- D-CARD-INDEX --
 --- front-end ---
 @author: SAV2
 @version 0.0.1
 @since: 07.10.2018
 **/

var currentPageUser = 0;
var currentPagePatient = 0;
var currentPageDcard = 0;
var currentPageValidateDcard = 0;

//reference to timer(timeout) ID value of the timer that is set
var delayTimer;
//delay time (ms)
var searchLatency = 1000;
//url to the back-end (main enrance)
var restServiceUrl = '/dcard/';

var fieldsToValidate = [
	'Сухой вес',
	'Зал',
	'Дата',
	'Время ГД',
	'Подача',
	'Поток ди-та/ф.поток',
	'Доза гепарина',
	'Болюс',
	'Вр. гепарин./оконч',
	'Бикарбонат',
	'Na+',
	'V-уф',
	'Ск.К.',
	'Вес (до ГД)',
	'АД-верх (до ГД)',
	'АД-нижн (до ГД)',
	'Пульс (до ГД)',
	'Вес (после ГД)',
	'АД-верх (после ГД)',
	'АД-нижн (после ГД)',
	'Пульс (после ГД)',
	'KT/V',
	'V перф. крови'
];

/* @since 23.04.2018
//g-recaptcha on load
function onloadCallback() {
    grecaptcha.render('grelem', {
        'sitekey' : '6LfFHhEUAAAAAIHSvYBhfCvQHgtz9qhiaHOfkS43',
        'callback' : 'recaptchaIsChecked',
        'expired-callback' : 'recaptchaExpired'
    });
};

//g-recaptcha is checked
function recaptchaIsChecked() {
    $('#send').attr('active', 'true');
    $('#send').removeClass('disabled');
};

//g-recaptcha expired
function recaptchaExpired() {
    $('#send').attr('active', 'false');
    $('#send').addClass('disabled');
}

//reset login form
function resetLoginForm() {
    grecaptcha.reset();
    $('#send').attr('active', 'false');
    $('#send').addClass('disabled');
}
*/
//compare #userpass and #userrepeat
function newpassIsLegit() {
    return ( $('#userpass').val() === $('#userrepeat').val() 
        && $('#userpass').val().length !== 0 
        && $('#userrepeat').val().length !== 0 );
}

//lock panel 
function lockPanel() {
    //$('body').css({'overflow': 'hidden'});
    $('#light_cover')
        .css({'display' : 'flex'})
        .hide()
        .stop(true, true).fadeIn(200);
}

//unlock panel
function unlockPanel() {
    //$('body').css({'overflow': 'auto'});
    $('#light_cover').stop(true, true).fadeOut(200);
}

/**
 * SHOW INFO BOX
 * @param {String} messageVal
 * @param {String} messageType
 * @returns {undefined}
 */
function showInfoBox(messageVal, messageType) {
    $('#sav2-infobox-info').empty();
    var infoBoxHTML = '';
    
    var infoBoxType = {
        'INFOBOX_SUCCESS': function(){
            infoBoxHTML += '<div class="alert alert-success fade in alert-dismissable">' +
                           '<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>';
            infoBoxHTML += '<span class="glyphicon glyphicon-ok-circle"></span> ' + messageVal;
            infoBoxHTML += '</div>';
        },
        'INFOBOX_ERROR': function(){
            infoBoxHTML += '<div class="alert alert-danger fade in alert-dismissable">' +
                           '<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>';
            infoBoxHTML += '<span class="glyphicon glyphicon-remove-circle"></span> ' + messageVal;
            infoBoxHTML += '</div>';
        },
        'INFOBOX_INFO': function(){
            infoBoxHTML += '<div class="alert alert-info fade in alert-dismissable">' +
                           '<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>';
            infoBoxHTML += '<span class="glyphicon glyphicon-info-sign"></span> ' + messageVal;
            infoBoxHTML += '</div>';
        },
        'DEFAULT': function(){
            infoBoxHTML += '<div class="alert alert-info fade in alert-dismissable">' +
                           '<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>';
            infoBoxHTML += '<span class="glyphicon glyphicon-info-sign"></span> ' + messageVal;
            infoBoxHTML += '</div>';
        }
    };
    
    (infoBoxType[messageType] || infoBoxType['DEFAULT'])();
    
    $('#sav2-infobox-info').html(infoBoxHTML);
}

/**
 * Represent Error Info
 * @param {String} representTypeInfo -- through INFOBOX or ALERT 
 * @param {String} errorInfo -- error description
 * @returns {undefined}
 */
function representError(representTypeInfo, errorInfo) {
    var representType = {
        'INFOBOX': function(){
            showInfoBox(errorInfo, 'INFOBOX_ERROR');
        },
        'ALERT': function(){
            alert(errorInfo);
        },
        'DEFAULT': function(){
            alert(errorInfo);
        }
    };
    
    (representType[representTypeInfo] || representType['DEFAULT'])();
}

/**
 * Process Error
 * @param {Object} dataObject
 * <dataObject.message> - special error message for identification of error type
 * <dataObject.methodName> - name of method where error has occurred
 * <dataObject.representType> - through INFOBOX or ALERT
 * @returns {Boolean} Error occurred (true) or didn't (false)
 */
function processException(dataObject) { 
    var errorOccured = false;
    
    var data = dataObject || {};
    data.message = (typeof data.message === 'undefined') ? 'DEFAULT_MESSAGE' : data.message;
    data.methodName = (typeof data.methodName === 'undefined') ? 'DEFAULT_METHOD' : data.methodName;
    data.representType = (typeof data.representType === 'undefined') ? 'INFOBOX' : data.representType;
    
    if (data.message === 'ERROR_ACCESS_DENIED') {
        errorOccured = true;
        representError(data.representType, 'access denied : method -- ' + data.methodName);
    } else if (data.message.indexOf('ERROR_PDO') !== -1) {
        errorOccured = true;
        var errorInfo = data.message.split('|');
        representError(data.representType, 'PDO Error: (' + errorInfo[1] + ') : method -- ' + data.methodName);
    } else if (data.message === 'CHANGE_IMPOSSIBLE') {
        errorOccured = true;
        representError(data.representType, 'Изменение\\Удаление невозможно');
    } else if (data.message === 'ERROR_POSTDATA_INCORRECT') {
        errorOccured = true;
        representError(data.representType, 'postdata is incorrect : method -- ' + data.methodName);
    } else if (data.message.indexOf('ERROR_TIME') !== -1) {
        errorOccured = true;
        var errorInfo = data.message.split('|');
        representError(data.representType, errorInfo[1]);
    } else if (data.message.indexOf('ERROR_WS') !== -1) {
        errorOccured = true;
        var errorInfo = data.message.split('|');
        representError(data.representType, 'Web service call error: ' + errorInfo[1]);
    } else if (data.message.indexOf('ERROR_JAVA') !== -1) {//ERROR
        errorOccured = true;
        var errorInfo = data.message.split('|');
        representError(data.representType, 'Java runtime error: ' + errorInfo[1]);
    }
    
    return errorOccured;
}

/**
 * prepare and execute AJAX-request
 * @param {Object} dataObject
 * <dataObject.method> - HTTP-method (GET, POST, PUT...)
 * <dataObject.url> - URL to which the request is sent
 * <dataObject.data> - Data to be sent to the server
 * <dataObject.dataType> - The type of data that you're expecting back from the server
 * <dataObject.timeout> - timeout (in milliseconds) for the request (0 means there will be no timeout)
 * -
 * <dataObject.success> - a function to be called if the request succeeds
 * <dataObject.error> - a function to be called if the request fails
 * <dataObject.complete> - a function to be called when the request finishes (after success and error callbacks are executed)
 * @returns {undefined}
 */
function doAJAX(dataObject) {
    var emptyFunc = function(){};
    var params = dataObject || {};
    
    params.method = (typeof params.method === 'undefined') ? 'POST' : params.method;
    params.url = (typeof params.url === 'undefined') ? '' : params.url;
    params.data = (typeof params.data === 'undefined') ? {} : params.data;
    params.dataType = (typeof params.dataType === 'undefined') ? 'text' : params.dataType;
    params.timeout = (typeof params.timeout === 'undefined') ? 10000 : params.timeout;
    
    params.success = (typeof params.success === 'undefined') ? emptyFunc : params.success;
    params.error = (typeof params.error === 'undefined') ? emptyFunc : params.error;
    params.complete = (typeof params.complete === 'undefined') ? emptyFunc : params.complete;
    
    lockPanel();
    
    $.ajax({
        method: params.method,
        url: params.url,
        data: params.data,
        dataType: params.dataType,
        timeout: params.timeout
    })
    .done(function(message) {
        unlockPanel();
        params.success(message);
    })
    .fail(function(){
        unlockPanel();
        params.error();
    })
    .always(function(){
        params.complete();
    });
}

/**
 * CHOOSE PANEL
 * @param {String} panelId
 * @returns {undefined}
 */
function choosePanel(panelId) {
    //window.___grecaptcha_cfg = undefined;//unset ___grecaptcha_cfg var
    
    var panelType = {
        '0'       : function(){ drawArea('login_page'); },
        '1'       : function(){ drawArea('admin_panel'); },
        '2'       : function(){ drawArea('another_panel'); },
        '3'       : function(){ drawArea('admin_panel'); },
        '-1'      : function(){ drawArea('login_page_lockeduser'); },
        '-2'      : function(){ drawArea('create_pass_page'); },
        'default' : function(){ drawArea('login_page'); }
    };
    
    (panelType[panelId] || panelType['default'])();
}

/**
 * LOAD WORKSPACE
 * @param {JSON} message
 * <message.isvalid> - true\false
 * <message.userid> - user ID
 * <message.userrole> - user role
 * @returns {undefined}
 */
function loadUserWorkspace(message) {
    var userData = $.parseJSON(message);

    if (userData.isvalid) {   
        doAJAX({
            url: restServiceUrl + 'load_workspace',
            data: {
                userid: userData.userid,
                userrole: userData.userrole
            },
            success: function(message) {
                choosePanel(message);
            },
            error: function(){
                alert('error occured during ajax-request to the server : ' +
                    'method -- loadUserWorkspace (load_workspace)');
            }
        });
    } else {
        alert('Wrong Login data');
    }
}

/** SHOW WORKSPACE based on user's privileges **/
function keepUserWorkspace() {    
    doAJAX({
        url: restServiceUrl + 'keep_workspace',
        data: {
            id: '0'
        },
        success: function(message) {
            choosePanel(message);
        },
        error: function(){
            alert('error occured during ajax-request to the server : ' +
                'method -- keepUserWorkspace (keep_workspace)');
        }
    });
}

/**
 * DRAW AREA TMPL
 * @param {String} areaTmpl
 * @returns {undefined}
 */
function drawArea(areaTmpl) {    
    doAJAX({
        url: restServiceUrl + 'draw_panel',
        data: {
            tmplname: areaTmpl
        },
        success: function(message) {
            $('.sav2-workspace').empty();
            $('.sav2-workspace').html(message);
            
            //@since 23.04.2018
            if (areaTmpl === 'login_page' || areaTmpl === 'login_page_lockeduser') {
                $('#send').attr('active', 'true');
                $('#send').removeClass('disabled');
            }
            //@since 23.04.2018
			
			if (areaTmpl === 'admin_panel') {
				selectPatients(currentPagePatient);
			}
        },
        error: function(){
            alert('error occured during ajax-request to the server : ' +
                'method -- drawArea (tmpl: ' + areaTmpl + ')');
        }
    });
}

/**
 * FILL TABLE with data
 * @param {Object} tableData - object that contains table data
 * <tableData.prefix> - prefix for current table instance
 * <tableData.content> - table content selector
 * <tableData.header> - items(columns names) of table header
 * @param {Object} dataVal - data object
 * <dataVal.countrows> - amount of rows
 * <dataVal.page> - page id
 * <dataVal.perpage> - rows per page
 * <dataVal.rowitems> - array of columns of each row
 * @returns {undefined}
 */
function fillTable(tableData, dataVal) {
    var numberOfPages = Math.ceil(dataVal.countrows / dataVal.perpage);
    numberOfPages = (numberOfPages < 1 ? 1 : numberOfPages);
    
    var tableString = '';
    //current page
    var currentPageSwitch = {
        'user': function(){
            currentPageUser = numberOfPages - 1;
            selectUsers(numberOfPages - 1);
        },
		'patient': function(){
			currentPagePatient = numberOfPages - 1;
			selectPatients(numberOfPages - 1);
		},
		'dcard': function(){
			currentPageDcard = numberOfPages - 1;
			selectDcards(numberOfPages - 1);
		},
		'validatedcard': function(){
			currentPageValidateDcard = numberOfPages - 1;
			validateDcards(numberOfPages - 1);
		},
        'default': function(){}
    };
    //header
    var headerSwitch = {
        'user': function(indexVal, valueVal) {
            if (indexVal === 0) {
                //do nothing
            } else if(indexVal === 2) {
                tableString += '<td style="text-align: right;">' + valueVal + '</td>';
            } else {
                tableString += '<td>' + valueVal + '</td>';
            }
        },
		'patient': function(indexVal, valueVal) {
			if (indexVal === 0) {
                //do nothing
            } else {
                tableString += '<td>' + valueVal + '</td>';
            }
		},
		'dcard': function(indexVal, valueVal) {
			if (indexVal === 2) {
                //do nothing
            } else {
                tableString += '<td>' + valueVal + '</td>';
            }
		},
		'validatedcard': function(indexVal, valueVal) {
			if (indexVal === 2) {
                //do nothing
            } else {
                tableString += '<td>' + valueVal + '</td>';
            }
		},
        'default': function(indexVal, valueVal) {
            tableString += '<td>' + valueVal + '</td>';
        }
    };
    //columns
    var columnsSwitch = {
        'user': function(indexVal, valueVal) {
            if (indexVal === 0 || indexVal === 1) {
                //do nothing
            } else {
               tableString += '<td>' + valueVal + '</td>'; 
            }
        },
		'patient': function(indexVal, valueVal) {
			if (indexVal === 0) {
                tableString += '<td><div data-placement="left" data-toggle="tooltip" title="id: ' + valueVal + '">';
            } else if (indexVal === 1) {
				tableString += valueVal + '</div></td>';
			} else {
               tableString += '<td>' + valueVal + '</td>'; 
            }
		},
		'dcard': function(indexVal, valueVal) {
			if (indexVal === 2) {
                tableString += '<td><div data-placement="left" data-toggle="tooltip" title="id: ' + valueVal + '">';
            } else if (indexVal === 3) {
				tableString += valueVal + '</div></td>';
			} else {
               tableString += '<td>' + valueVal + '</td>'; 
            }
		},
		'validatedcard': function(indexVal, valueVal) {
			if (indexVal === 2) {
                tableString += '<td><div data-placement="left" data-toggle="tooltip" title="id: ' + valueVal + '">';
            } else if (indexVal === 3) {
				tableString += valueVal + '</div></td>';
			} else if (indexVal >= 5 && indexVal <= 27) {
				if (indexVal == 5) {
					tableString += '<td>';
				}
				//-----------------------------
				if (valueVal === '') {
					tableString += '<div class="sav2-object-li">';
					tableString += '<span class="label label-danger"><i class="fas fa-minus-circle"></i></span> ' + fieldsToValidate[indexVal-5];//"-5" coz of fieldsToValidate[0..23] but indexVal between 5..27
					tableString += '</div>';
				}
				//-----------------------------
				if (indexVal == 27) {
					tableString += '</td>';
				}
			} else {
               tableString += '<td>' + valueVal + '</td>'; 
            }
		},
        'default': function(indexVal, valueVal) {
            tableString += '<td>' + valueVal + '</td>';
        }
    };
    //action columns
    var actionColumnsSwitch = {
        //arrVal[0] is supposed to be 'id' of current row(element)
        'user': function(arrVal) {
            tableString += 
            '<td style="min-width: 200px; text-align: right;">' +
            '<button title="Изменить данные учетной записи" type="button" ' +
            'class="btn btn-success btn-sm sav2-opt-btn sav2-upd-' + 'user' + '" ' +
            'data-toggle="modal" data-target="#updateElement" id="' + arrVal[0] + '">' +
                '<i class="fas fa-id-card" aria-hidden="true"></i>' +
            '</button>';
            //lock or unlock button (regarding of current users's state)
            if (arrVal[1]===0) {
                tableString += 
                '<button title="" type="button" ' +
                'class="btn btn-info btn-sm sav2-opt-btn sav2-lock-' + 'user' + '" id="' + arrVal[0] + '" ' +
                'data-toggle="tooltip" data-placement="top" data-original-title="Разблокирован. Нажмите чтобы заблокировать">' +
                    '<i class="fas fa-lock-open" aria-hidden="true"></i>' +
                '</button>';
            } else {
                tableString +=  
                '<button title="" type="button" ' +
                'class="btn btn-warning btn-sm sav2-opt-btn sav2-unlock-' + 'user' + '" id="' + arrVal[0] + '" ' + 
                'data-toggle="tooltip" data-placement="top" data-original-title="Заблокирован. Нажмите чтобы разблокировать">' +
                    '<i class="fas fa-lock" aria-hidden="true"></i>' +
                '</button>';
            }
        },
		'patient': function(arrVal) {
			tableString += 
            '<td>' +
            '<button title="Изменить данные" type="button" ' +
            'class="btn btn-success btn-sm sav2-opt-btn sav2-upd-' + 'patient' + '" ' +
            'data-toggle="modal" data-target="#updateElement" id="' + arrVal[0] + '">' +
                '<i class="fas fa-pencil-alt" style="font-size: 18px;"></i>' +
            '</button>' +
            '<button title="Завести карту" type="button" ' +
            'class="btn btn-warning btn-sm sav2-opt-btn sav2-addcard-' + 'patient" ' + 
			'data-toggle="modal" data-target="#insertElement" ' +
			'id="' + arrVal[0] + '" patientfio="' + arrVal[1] + '">' +
                '<i class="fas fa-file-medical" style="font-size: 18px;"></i>' +
            '</button>' +
			'<button title="Просмотр текущих карт" type="button" ' +
            'class="btn btn-info btn-sm sav2-opt-btn sav2-showcards-' + 'patient' + '" id="' + arrVal[0] + '">' +
                '<i class="fas fa-arrow-right" style="font-size: 18px;"></i>' +
            '</button>';
		},
		'dcard': function(arrVal) {
            tableString += 
            '<td>' +
            '<button title="Удалить" type="button" ' +
            'class="btn btn-danger btn-sm sav2-opt-btn sav2-del-' + 'dcard' + '" id="' + arrVal[0] + '">' +
                '<i class="far fa-trash-alt" style="font-size: 18px;"></i>' +
            '</button>'+
			'<button title="Печать первой части" type="button" ' +
            'class="btn btn-primary btn-sm sav2-opt-btn sav2-print-i-' + 'dcard' + '" id="' + arrVal[0] + '">' +
                '<i class="fas fa-file-word" style="font-size: 18px;"></i> I' +
            '</button>'+
			'<button title="Печать второй части" type="button" ' +
            'class="btn btn-primary btn-sm sav2-opt-btn sav2-print-ii-' + 'dcard' + '" id="' + arrVal[0] + '">' +
                '<i class="fas fa-file-word" style="font-size: 18px;"></i> II' +
            '</button>'+
			'<button title="Печать всей карты" type="button" ' +
            'class="btn btn-primary btn-sm sav2-opt-btn sav2-print-' + 'dcard' + '" id="' + arrVal[0] + '">' +
                '<i class="fas fa-file-word" style="font-size: 18px;"></i>' +
            '</button>'+
			'<button title="Работа с картой" type="button" ' +
            'class="btn btn-success btn-sm sav2-opt-btn sav2-process-' + 'dcard' + '" id="' + arrVal[0] + '">' +
                '<i class="far fa-clipboard" style="font-size: 18px;"></i>' +
            '</button>';
        },
		'validatedcard': function(arrVal) {
            tableString += 
            '<td>' +
			'<button title="Работа с картой" type="button" ' +
            'class="btn btn-success btn-sm sav2-opt-btn sav2-process-' + 'dcard' + '" id="' + arrVal[0] + '">' +
                '<i class="far fa-clipboard" style="font-size: 18px;"></i>' +
            '</button>';
        },
        'default': function(arrVal) {
            tableString += 
            '<td>' +
            '<button title="Изменить" type="button" ' +
            'class="btn btn-success btn-sm sav2-opt-btn sav2-upd-' + 'default' + '" ' +
            'data-toggle="modal" data-target="#updateElement" id="' + arrVal[0] + '">' +
                '<span class="glyphicon glyphicon-pencil"></span>' +
            '</button>' +
            '<button title="Удалить" type="button" ' +
            'class="btn btn-danger btn-sm sav2-opt-btn sav2-del-' + 'default' + '" id="' + arrVal[0] + '">' +
                '<span class="glyphicon glyphicon-trash"></span>' +
            '</button>';
        }
    };
    //onPageClick
    var onPageClickSwitch = {
        'user': function(curPageVal) {
            currentPageUser = curPageVal;
            selectUsers(currentPageUser);
        },
		'patient': function(curPageVal) {
			currentPagePatient = curPageVal;
			selectPatients(currentPagePatient);
		},
		'dcard': function(curPageVal){
			currentPageDcard = curPageVal;
			selectDcards(currentPageDcard);
		},
		'validatedcard': function(curPageVal){
			currentPageValidateDcard = curPageVal;
			validateDcards(currentPageValidateDcard);
		},
        'default': function(curPageVal){}
    };
    
    var curPage = parseInt(dataVal.page) + 1;// id + 1, i.e. page starts from 0, but in pagination plugin page starts from 1

    if (curPage > numberOfPages) {
        (currentPageSwitch[tableData.prefix] || currentPageSwitch['default'])();
        return;//"exit" fillTable method
    }

    //amount of selected rows info
    tableString +=
    '<div class="input-group">' +
        '<span class="input-group-addon">Всего найдено записей: </span>' +
        '<input id="rowsCount" type="text" class="form-control" ' +
        'disabled="" style="max-width: 200px;" value="' + dataVal.countrows + '">' +
    '</div>' +
    '<hr />';

    tableString += '<ul class="pagination sav2-pages-' + tableData.prefix + '"></ul>';

    //table body start:	
    tableString +=
        '<div class="table-responsive">' +
            '<table class="table table-striped">';

    //header start:
    tableString += '<tr class="info">';

    $.each(tableData.header, function(index, value) { 
        (headerSwitch[tableData.prefix] || headerSwitch['default'])(index, value);
    });

    tableString += '</tr>';
    //header end;

    //rows start:
    $.each(dataVal.rowitems, function(index, value) {
        if (value.length !== 0) {
            tableString += '<tr>';

            //columns start:
            $.each(value, function(index, value) {
                (columnsSwitch[tableData.prefix] || columnsSwitch['default'])(index, value);
            });
            //columns end;

            /** 
             single column with options
             value[0] is supposed to be 'id' of current row(element)	
             */
            (actionColumnsSwitch[tableData.prefix] || actionColumnsSwitch['default'])(value);

            tableString +=     '</td>' + //closing tag for action column
                           '</tr>';
        }
    });
    //rows end;

    tableString +=
            '</table>' +
        '</div>';
    //table body end;

    tableString += '<ul class="pagination sav2-pages-' + tableData.prefix + '"></ul>';

    //fill table content
    $(tableData.content).empty();
    $(tableData.content).html(tableString);
    //pagination start:
    $('.sav2-pages-' + tableData.prefix).twbsPagination({
        totalPages: numberOfPages,
        visiblePages: 7,
        initiateStartPageClick: false,
        startPage: curPage,
        first: '<span class="glyphicon glyphicon-backward" title="В начало"></span>',
        prev: '<span class="glyphicon glyphicon-step-backward" title="Предыдущая"></span>',
        next: '<span class="glyphicon glyphicon-step-forward" title="Следующая"></span>',
        last: '<span class="glyphicon glyphicon-forward" title="В конец"></span>',
        onPageClick: function(event, page) {            
            (onPageClickSwitch[tableData.prefix] || onPageClickSwitch['default'])(page - 1);
        }
    });
    //pagination end;
}

/**
 * SELECT <some_elements>
 * @param {String} queryName - call special method from backend
 * @param {Object} searchParams - object of search paramateres with its values
 * @param {Object} tableData - prefix | content - i.e. element(tag) selector | header
 * @returns {undefined}
 */
function doSelect(queryName, searchParams, tableData) {    
    doAJAX({
        url: restServiceUrl + queryName,
        data: searchParams,
        success: function(message) {
            if ( !processException({message: message, methodName: queryName}) ) {//if exception hasn't occurred  
                var selectedData = $.parseJSON(message);
                fillTable(tableData, selectedData);
                if (queryName === 'select_users' || 
					queryName === 'select_patients' || 
					queryName === 'select_dcards' ||
					queryName === 'validate_dcards') {
                    $('[data-toggle="tooltip"]').tooltip();
                }
            }
        },
        error: function(){
            showInfoBox('error occured during ajax-request to the server : ' +
                'method -- doSelect (' + queryName + ')', 'INFOBOX_ERROR');
        }
    });
}

/**
 * DELETE <some_elements>
 * @param {String} queryName - call special method from backend
 * @param {Object} searchParams - usually 'id' of manipulated element
 * @param {String} elementDescription - 'EXIT', 'USER'
 * @param {int} curPageId - current page
 * @returns {undefined}
 */
function doDelete(queryName, searchParams, elementDescription, curPageId) {    
    doAJAX({
        url: restServiceUrl + queryName,
        data: searchParams,
        success: function(message) {
            if ( !processException({message: message, methodName: queryName}) ) {//if exception hasn't occurred
                showInfoBox(message, 'INFOBOX_SUCCESS');
                switch (elementDescription) {
                    case 'USER':
                        selectUsers(curPageId);
                        break;
					case 'DCARD':
						selectDcards(curPageId);
						break;
                }
            }
        },
        error: function(){
            showInfoBox('error occured during ajax-request to the server : ' +
                'method -- doDelete (' + queryName + ')', 'INFOBOX_ERROR');
        }
    });
}

/**
 * build input form for called "UpdateModal"-window
 * @param {int} element_id - element's ID
 * @param {String} tmpl_name - template's name
 * @returns {undefined}
 */
function loadUpdateForm(element_id, tmpl_name) {    
    doAJAX({
        url: restServiceUrl + 'draw_panel',
        data: {
            tmplname: tmpl_name
        },
        success: function(message) {
            $('#elementDataUpd').empty();
            $('#elementDataUpd').html(message);
        },
        complete: function(){
            switch (tmpl_name) {
                case 'update_user_modal':
                    setEditFieldsForUpdateModal(element_id,
                        'select_user_by_id',
                        {
                            mainTitle: 'Изменение данных пользователя', 
                            paragraph: 'Данные пользователя:' 
                        }
                    );
                    break;
				case 'update_patient_modal':
					setEditFieldsForUpdateModal(element_id,
                        'select_patient_by_id',
                        {
                            mainTitle: 'Изменение данных пациента', 
                            paragraph: 'Данные пациента:' 
                        }
                    );
					break;
            }
        },
        error: function(){
            showInfoBox('error occured during ajax-request to the server : ' +
                'method -- loadUpdateForm (' + tmpl_name + ')', 'INFOBOX_ERROR');
        }
    });
}

/**
 * fill input fields with current(actual) values of "UpdateModal"-window
 * @param {int} element_id - element's ID 
 * @param {String} queryName - call special method from backend
 * @param {Object} modalTitles - text titles for 'mainTitle' | 'paragraph'
 * @returns {undefined}
 */
function setEditFieldsForUpdateModal(element_id, queryName, modalTitles) {    
    doAJAX({
        url: restServiceUrl + queryName,
        data: {
            id: element_id
        },
        success: function(message) {
            if ( !processException({message: message, methodName: queryName}) ) {//if exception hasn't occurred
                $('#updateElement .modal-title').empty();
                $('#updateElement .modal-body p').empty();
                $('#updateElement .modal-title').html(modalTitles.mainTitle);
                $('#updateElement .modal-body p').html(modalTitles.paragraph);

                var elementDataObj = $.parseJSON(message);
                $('#entity').val(elementDataObj.entity);
                $.each(elementDataObj.fields, function(key, value) {
                    //special fields start:
                    if (key.indexOf('calcperiodDevicevalsUpd') !== -1) {
                        $('#' + key).datepicker('update', value);
                    } else if (key.indexOf('isNormativeUpd') !== -1) {
                        if (value === '1') {
                            $('#' + key).prop('checked', true);
                        } else {
                            $('#' + key).prop('checked', false);
                        }
                    } else if (key.indexOf('pointExitUpd') !== -1) {
                        $('#' + key).val(value).change();
                    } else if (key.indexOf('patientBirthdateUpd') !== -1) {
                        $('#' + key).datepicker('update', value);
                    }
                    //special fields end;
                    else {
                        $('#' + key).val(value);
                    }
                });
            }
        },
        error: function(){
            showInfoBox('error occured during ajax-request to the server : ' +
                'method -- setEditFieldsForUpdateModal (' + queryName + ')', 'INFOBOX_ERROR');
        }
    });
}

/**
 * UPDATE <some_elements>
 * @param {String} queryName - call special method from backend
 * @param {Object} dataObject - POST-parameters
 * @param {function} refreshCallback - callback function to refresh the content afterwards
 * @returns {undefined}
 */
function doUpdate(queryName, dataObject, refreshCallback) {    
    doAJAX({
        url: restServiceUrl + queryName,
        data: dataObject,
        success: function(message) {
            if ( !processException({message: message, methodName: queryName}) ) {//if exception hasn't occurred
                showInfoBox(message, 'INFOBOX_INFO');
            }
        },
        error: function(){
            showInfoBox('error occured during ajax-request to the server : ' +
                'method -- doUpdate (' + queryName + ')', 'INFOBOX_ERROR');
        },
        complete: function() {
            refreshCallback();
        }
    });
}

/**
 * build input form for called "InsertModal"-window
 * @param {int} element_id - ?
 * @param {int} additional_id - ?
 * @param {String} tmpl_name - template's name
 * @returns {undefined}
 */
function loadInsertForm(element_id, additional_id, tmpl_name) {    
    doAJAX({
        url: restServiceUrl + 'draw_panel',
        data: {
            tmplname: tmpl_name
        },
        success: function(message) {
            $('#elementDataIns').empty();
            $('#elementDataIns').html(message);
        },
        complete: function(){
            $('#insertElement .modal-title').empty();
            $('#insertElement .modal-body p').empty();
            switch (tmpl_name) {
                case 'insert_user_modal':
					$('#insertElement .modal-title').html('Ввод нового пользователя');
                    $('#insertElement .modal-body p').html('Данные пользователя:');
                    break;
				case 'insert_patient_modal':
					$('#insertElement .modal-title').html('Ввод нового пациента');
                    $('#insertElement .modal-body p').html('Данные пациента:');
					break;
				case 'insert_dcard_modal':
					$('#insertElement .modal-title').html('Создание диализной карты на пациента');
                    $('#insertElement .modal-body p').html('Данные по карте:');
					$('#insertElement #elementDataIns #patientIDIns').val(element_id);
                    $('#insertElement #elementDataIns #patientFioIns').val(additional_id);
					$('#insertElement #elementDataIns #dcardProcDateIns').datepicker('update', new Date());
					break;
            }
        },
        error: function(){
            showInfoBox('error occured during ajax-request to the server : ' +
                'method -- loadInsertForm (' + tmpl_name + ')', 'INFOBOX_ERROR');
        }
    });
}

/**
 * INSERT <some_elements>
 * @param {String} queryName - call special method from backend
 * @param {Object} dataObject - POST-parameters
 * @param {function} refreshCallback - callback function to refresh the content afterwards
 * @returns {undefined}
 */
function doInsert(queryName, dataObject, refreshCallback) {    
    doAJAX({
        url: restServiceUrl + queryName,
        data: dataObject,
        success: function(message) {
            if ( !processException({message: message, methodName: queryName}) ) {//if exception hasn't occurred
                showInfoBox(message, 'INFOBOX_INFO');
            }
        },
        error: function(){
            showInfoBox('error occured during ajax-request to the server : ' +
                'method -- doInsert (' + queryName + ')', 'INFOBOX_ERROR');
        },
		complete: function() {
            refreshCallback();
        }
    });
}

//tab-1 patients
function selectPatients(pageId) {
	doSelect('select_patients',
		{
			page: pageId,
			id: $('#srch-patient-id').val().trim(),
			ambnum: $('#srch-patient-ambnum').val().trim(),
			fio: $('#srch-patient-fio').val().trim(),
			birthdate: $('#srch-patient-birthdate').val().trim()
		},
		{
			prefix: 'patient',
			content: '.sav2-edit-patient-table',
			header: ['id', 'ФИО', 'Дата рождения', 'Рост (см)', '№ амб. карты', 'Действие']
		}
	);
}

function updatePatient() {    
    doUpdate('update_patient',
        {
			id: $('#updateElement #elementDataUpd #idUpd').val(),
            fio: $('#updateElement #elementDataUpd #patientFioUpd').val().replace(/\\/g, "/").replace(/"/g, '\\"').trim(),
            birthdate: $('#updateElement #elementDataUpd #patientBirthdateUpd').val().trim(),
			height: $('#updateElement #elementDataUpd #patientHeightUpd').val().trim(),
			ambnum: $('#updateElement #elementDataUpd #patientAmbnumUpd').val().trim()
        },
	function() {selectPatients(currentPagePatient);}
    );
}

function insertPatient() {    
    doInsert('insert_patient',
        {
            fio: $('#insertElement #elementDataIns #patientFioIns').val().replace(/\\/g, "/").replace(/"/g, '\\"').trim(),
            birthdate: $('#insertElement #elementDataIns #patientBirthdateIns').val().trim(),
			height: $('#insertElement #elementDataIns #patientHeightIns').val().trim(),
			ambnum: $('#insertElement #elementDataIns #patientAmbnumIns').val().trim()
        },
	function() {selectPatients(currentPagePatient);}
    );
}

function insertDcard() { 
	var currentdate = new Date(); 
	var datetime = "creation timestamp: " + currentdate.getDate() + "-"
					+ (currentdate.getMonth()+1)  + "-" 
					+ currentdate.getFullYear() + " @ "  
					+ currentdate.getHours() + ":"  
					+ currentdate.getMinutes() + ":" 
					+ currentdate.getSeconds();
					
    doInsert('insert_dcard',
        {
            patientid: $('#insertElement #elementDataIns #patientIDIns').val().trim(),
            date: $('#insertElement #elementDataIns #dcardProcDateIns').val().trim(),
			dprocedureid: $('#insertElement #elementDataIns #dcardProcTypeIns').val(),
			changelog: ''+ datetime +' by '+ $('#userinfo4').val().trim() + ' (id:'+ $('#userinfo4').attr('userid') +')'
        },
		function() {
			$('#srch-dcard-patientid').val( $('#insertElement #elementDataIns #patientIDIns').val().trim() );
			$('#srch-dcard-patientid').css({'background-color': 'rgba(255, 0, 0, 0.25)'});
			$('#showTab2').trigger('click');
		}
    );
}

//tab-2 dcards
function selectDcards(pageId) {
	doSelect('select_dcards',
		{
			page: pageId,
			id: $('#srch-dcard-id').val().trim(),
			patientid: $('#srch-dcard-patientid').val().trim(),
			patientambnum: $('#srch-dcard-patientambnum').val().trim(),
			date: $('#srch-dcard-date').val().trim(),
			patientfio: $('#srch-dcard-patientfio').val().trim()
		},
		{
			prefix: 'dcard',
			content: '.sav2-edit-dcard-table',
			header: ['id', 'Дата процедуры', 'id пациента', 'Пациент', '№ амб. карты', 'Действие']
		}
	);
}

//tab-3 dcard form
function selectDcardByID(dcardID) {
	if (dcardID !== '') {			
			doAJAX({
				url: restServiceUrl + 'select_dcard_by_id',
				data: {
					id: dcardID
				},
				success: function(message) {
					if ( !processException({message: message, methodName: 'select_dcard_by_id'}) ) {//if exception hasn't occurred
						var elementDataObj = $.parseJSON(message);
						$.each(elementDataObj.fields, function(key, value) {
							//special fields start:
							if (key === 'd6') {
								$('#' + key).datepicker('update', value);
							} else if (key === 'd23' ||
									   key === 'd24' ||
									   key === 'd26' ||
									   key === 'd27' ||
									   key === 'd44' ||
									   key === 'd59' ||
									   key === 'd61' ||
									   key === 'd62') {
								if (value === 0) {
									$('#' + key).prop('checked', false);
								} else {
									$('#' + key).prop('checked', true);
								}
							} else if (key == 'dwdynamicdetails') {
								$('#' + key).attr("data-original-title",value);
							}
							//special fields end;
							else {
								$('#' + key).val(value);
							}
						});
					}
				},
				error: function(){
					showInfoBox('error occured during ajax-request to the server : ' +
						'method -- #showTab3:click (' + 'select_dcard_by_id' + ')', 'INFOBOX_ERROR');
				}
			});
		}
}

function updateDcard() { 
	
	var currentdate = new Date(); 
	var datetime = "modification timestamp: " + currentdate.getDate() + "-"
					+ (currentdate.getMonth()+1)  + "-" 
					+ currentdate.getFullYear() + " @ "  
					+ currentdate.getHours() + ":"  
					+ currentdate.getMinutes() + ":" 
					+ currentdate.getSeconds();
	
    doUpdate('update_dcard',
        {
			d_procedure_id 			: $('#d0').val().trim(),
			dry_weight 				: $('#d2').val().trim(),
			room 					: $('#d5').val().replace(/\\/g, "/").replace(/"/g, '\\"').trim(),
			date 					: $('#d6').val().trim(),
			device_id 				: $('#d7').val().trim(),
			dialyzer_id 			: $('#d8').val().trim(),
			gd_period_minutes 		: $('#d9').val().trim(),
			inject_speed 			: $('#d10').val().trim(),
			dialysate_id 			: $('#d11').val().trim(),
			stream_dita 			: $('#d12').val().trim(),
			heparin_dose 			: $('#d13').val().trim(),
			bolus 					: $('#d14').val().trim(),
			vr_heparin_complete 	: $('#d15').val().trim(),
			bicarbonate 			: $('#d16').val().trim(),
			na 						: $('#d17').val().trim(),
			v_uf 					: $('#d18').val().trim(),
			sk_k 					: $('#d19').val().trim(),
			pre_weight 				: $('#d20').val().trim(),
			pre_ap_up 				: $('#d21a').val().trim(),
			pre_ap_low 				: $('#d21b').val().trim(),
			pre_pulse 				: $('#d22').val().trim(),
			pre_complaint 			: $('#d23').is(':checked') ? '1' : '0',
			pre_edema 				: $('#d24').is(':checked') ? '1' : '0',
			pre_state_id 			: $('#d25').val().trim(),
			pre_breath_changes 		: $('#d26').is(':checked') ? '1' : '0',
			pre_wheeze 				: $('#d27').is(':checked') ? '1' : '0',
			pre_wheeze_local 		: $('#d28').val().replace(/\\/g, "/").replace(/"/g, '\\"').trim(),
			pre_heart_rhythm_id 	: $('#d29').val().trim(),
			pre_stomach_soft_id 	: $('#d30').val().trim(),
			pre_stomach_pain_id 	: $('#d31').val().trim(),
			pre_stomach_pain_local 	: $('#d32').val().replace(/\\/g, "/").replace(/"/g, '\\"').trim(),
			pre_area_avf_id 		: $('#d33').val().trim(),
			pre_noise_avf_id 		: $('#d34').val().trim(),
			pre_additions 			: $('#d35').val().replace(/\\/g, "/").replace(/"/g, '\\"').trim(),
			epoetin_alfa 			: $('#d36').val().trim(),
			epoetin_beta 			: $('#d37').val().trim(),
			aranesp 				: $('#d38').val().trim(),
			mircera 				: $('#d39').val().trim(),
			post_injection_id 		: $('#d40').val().trim(),
			ferrum_dextran 			: $('#d41').val().trim(),
			ferrum_sacch 			: $('#d42').val().trim(),
			vit_c 					: $('#d43').val().trim(),
			vit_b 					: $('#d44').is(':checked') ? '1' : '0',
			post_weight 			: $('#d45').val().trim(),
			post_ap_up 				: $('#d47a').val().trim(),
			post_ap_low 			: $('#d47b').val().trim(),
			post_pulse 				: $('#d48').val().trim(),
			ktv 					: $('#d49').val().trim(),
			v_perf_blood 			: $('#d50').val().trim(),
			v_replacement 			: $('#d51').val().trim(),
			pre_glucose 			: $('#d52').val().trim(),
			post_glucose 			: $('#d53').val().trim(),
			body_temp 				: $('#d54').val().trim(),
			electrolyte_ca 			: $('#d55').val().trim(),
			electrolyte_k 			: $('#d56').val().trim(),
			electrolyte_na			: $('#d57').val().trim(),
			ekg 					: $('#d58').val().replace(/\\/g, "/").replace(/"/g, '\\"').trim(),
			post_complaint 			: $('#d59').is(':checked') ? '1' : '0',
			post_state_id 			: $('#d60').val().trim(),
			post_gd_difficulties 	: $('#d61').is(':checked') ? '1' : '0',
			post_change_required 	: $('#d62').is(':checked') ? '1' : '0',
			post_additions 			: $('#d63').val().replace(/\\/g, "/").replace(/"/g, '\\"').trim(),
			id 						: $('#dcardid').val().trim(),
			changelog  				: '|'+ datetime +' by '+ $('#userinfo4').val().trim() + ' (id:'+ $('#userinfo4').attr('userid') +')'
        },
		function() {
			$('html, body').animate({scrollTop: 0}, 500);
			selectDcardByID($('#dcardid').val().trim());
		}
    );
}

//tab-4 users
function selectUsers(pageId) {
    doSelect('select_users',
        {
            page: pageId,
            userfio: $('#srch-user-fio').val().trim()
        },
        {
            prefix: 'user',
            content: '.sav2-edit-user-table',
            header: ['id', 'ФИО сотрудника', 'Действие']
        }
    );
}

function updateUser() {    
    doUpdate('update_user',
        {
            id: $('#updateElement #elementDataUpd #idUpd').val(),
            fio: $('#updateElement #elementDataUpd #fioUserUpd').val().replace(/\\/g, "/").replace(/"/g, '\\"').trim(),
			login: $('#updateElement #elementDataUpd #loginUserUpd').val().replace(/\\/g, "/").replace(/"/g, '\\"').trim(),
            pass: $('#updateElement #elementDataUpd #passwordUserUpd').val(),
            firstlogin: 1
        },
	function() {selectUsers(currentPageUser);}
    );
}

function insertUser() {    
    doInsert('insert_user',
        {
            fio: $('#insertElement #elementDataIns #userFioIns').val().replace(/\\/g, "/").replace(/"/g, '\\"').trim(),
            login: $('#insertElement #elementDataIns #userLoginIns').val().replace(/\\/g, "/").replace(/"/g, '\\"').trim(),
            pass: $('#insertElement #elementDataIns #userPasswordIns').val(),
            role: $('#insertElement #elementDataIns #userRoleIns').val()
        },
	function() {selectUsers(currentPageUser);}
    );
}

//tab-5 validate dcards
function validateDcards(pageId) {
	doSelect('validate_dcards',
		{
			page: pageId
		},
		{
			prefix: 'validatedcard',
			content: '.sav2-validate-dcard-table',
			header: ['id', 'Дата процедуры', 'id пациента', 'Пациент', '№ амб. карты', 'Поля', 'Действие']
		}
	);
}

//initialization: kinda -- "public static void main(String[] args){ ... }"
/**
 *  public static void (String[] args){ ... }
 */
$(document).ready(function(){
    //globals
    currentPageUser = 0;
	currentPagePatient = 0;
	currentPageDcard = 0;
	currentPageValidateDcard = 0;
	
    keepUserWorkspace();
	
    //login button
    $(document).on('click', '#send', function(){

        var usr = $('#usr').val().trim();
        var pwd = $('#pwd').val();

        if ($(this).attr('active') === 'true' && usr.length !== 0 && pwd.length !== 0) { 
            doAJAX({
                url: restServiceUrl + 'login',
                data: {
                    id: 'isuservalid',
                    usr: usr,
                    pwd: pwd,
                    grr: ''//grecaptcha.getResponse() @since 23.04.2018
                },
                success: function(message) {
                    //resetLoginForm();//g-recaptcha reset @since 23.04.2018
                    if ( !processException({message: message, methodName: 'login', representType: 'ALERT'}) ) {//if exception hasn't occurred
                        loadUserWorkspace(message);
                    }
                },
                error: function(){
                    //resetLoginForm();//g-recaptcha reset @since 23.04.2018
                    alert('error occured during ajax-request to the server : ' +
                        'method -- login');
                }
            });
        }
    });
    
    //change password button
    $(document).on('click', '#changepass', function(){
        var pwd = $('#userpass').val();
        
        if ($(this).attr('active') === 'true' && pwd.length !== 0) {
            doUpdate('update_user',
                {
                    id: $('#userfio').attr('userid'),
                    fio: $('#userfio').val().replace(/\\/g, "/").replace(/"/g, '\\"').trim(),
                    pass: pwd,
                    firstlogin: 0 
                },
                function() { keepUserWorkspace(); }
            );
        }
    });
    
    //handle 'ENTER' keypress event
    $(document).on('keypress', '#usr', function(e) {
        if (e.which === 13) {
            $('#send').trigger('click');
            return false;
        }
    });

    //handle 'ENTER' keypress event
    $(document).on('keypress', '#pwd', function(e) {
        if (e.which === 13) {
            $('#send').trigger('click');
            return false;
        }
    });
    
    //handle 'INPUT' event -- sign in for the first time --
    $(document).on('input', '#userpass', function(e) {
        if ( newpassIsLegit() ) {
            $('#changepass').attr('active', 'true');
            $('#changepass').removeClass('disabled');
        } else {
            $('#changepass').attr('active', 'false');
            $('#changepass').addClass('disabled');
        }
    });
    
    //handle 'INPUT' event -- sign in for the first time --
    $(document).on('input', '#userrepeat', function(e) {
        if ( newpassIsLegit() ) {
            $('#changepass').attr('active', 'true');
            $('#changepass').removeClass('disabled');
        } else {
            $('#changepass').attr('active', 'false');
            $('#changepass').addClass('disabled');
        }
    });

    //logout button
    $(document).on('click', '#logout', function(){        
        doAJAX({
            url: restServiceUrl + 'logout',
            data: {
                id: '0'
            },
            success: function(message) {
                
            },
            error: function(){
                alert('error occured during ajax-request to the server : ' +
                    'method -- logout');
            },
            complete: function(){
                keepUserWorkspace();
            }
        });
    });

    //Admin workarea options (tabs)
    $(document).on('click', '.sav2-admin-wa .btn-group .btn', function(){
        $('.sav2-admin-wa .btn-group .btn').removeClass('active');
        $(this).addClass('active');

        var tabToShow = '.sav2-tab1';
        
        var showTabSwitch = {
            'showTab2': function(){tabToShow = '.sav2-tab2';},
            'showTab3': function(){tabToShow = '.sav2-tab3';},
            'showTab4': function(){tabToShow = '.sav2-tab4';},
            'showTab5': function(){tabToShow = '.sav2-tab5';},
            'showTab6': function(){tabToShow = '.sav2-tab6';},
            'showTab7': function(){tabToShow = '.sav2-tab7';},
            'default' : function(){tabToShow = '.sav2-tab1';}
        };
        
        (showTabSwitch[$(this).attr('id')] || showTabSwitch['default'])();
        
        $('.sav2-tabs').hide(0, function(){
            $(tabToShow).show(0);
        });
    });

    //modal window for update element -- button "updElementYes"
    $(document).on('click', '#updElementYes', function(){
        switch ($('#updateElement #elementDataUpd #entity').val()) {
            case 'user':
                updateUser();
                break;
			case 'patient':
				updatePatient();
				break;
        }
    });

    //modal window for insert element -- button "insElementYes"
    $(document).on('click', '#insElementYes', function(){
        switch ($('#insertElement #elementDataIns #entity').val()) {
            case 'user':
                insertUser();
                break;
			case 'patient':
				insertPatient();
				break;
			case 'dcard':
				insertDcard();
				break;
        }
    });
	
	/** -- TAB 1 -- **/
	//Admin workarea Tab-1
    //show up
    $(document).on('click', '#showTab1', function(){
        selectPatients(currentPagePatient);
    });
    
	//Admin workarea Tab-1 (datepicker search)
    $(document).on('change', '#srch-patient-birthdate', function(){
        selectPatients(currentPagePatient);
    });
	
	//Admin workarea Tab-1 search
    $(document).on('input', '.sav2-srch-patient', function(){
        clearTimeout(delayTimer);
        delayTimer = setTimeout(function() {
           selectPatients(currentPagePatient);
        }, searchLatency);
    });

    //Admin workarea Tab-1 clear search input
    $(document).on('click', '.clear-srch-patient', function(){
        $(this).parents('.input-group').find('.sav2-srch-patient').val('');
        selectPatients(currentPagePatient);
    });
	
	//Admin workarea Tab-1 update patient
    $(document).on('click', '.sav2-upd-patient', function(){
        loadUpdateForm($(this).attr('id'), 'update_patient_modal');
    });
	
	//Admin workarea Tab-1 insert new patient
    $(document).on('click', '#addnewpatient', function () {
        loadInsertForm(0, 0, 'insert_patient_modal');
    });
	
	//Admin workarea Tab-1 insert new dcard
    $(document).on('click', '.sav2-addcard-patient', function () {
        loadInsertForm($(this).attr('id'), $(this).attr('patientfio'), 'insert_dcard_modal');
    });
	
	//Admin workarea Tab-1 (show dcards)
    $(document).on('click', '.sav2-showcards-patient', function () {
        $('#srch-dcard-patientid').val($(this).attr('id'));
        $('#srch-dcard-patientid').css({'background-color': 'rgba(255, 0, 0, 0.25)'});
        $('#showTab2').trigger('click');
    });
	
    /** -- TAB 2 -- **/
    //Admin workarea Tab-2
    //show up
    $(document).on('click', '#showTab2', function(){
        selectDcards(currentPageDcard);
    });
	
	//Admin workarea Tab-2 (datepicker search)
    $(document).on('change', '#srch-dcard-date', function(){
        selectDcards(currentPageDcard);
    });
	
	//Admin workarea Tab-2 search
    $(document).on('input', '.sav2-srch-dcard', function(){
        clearTimeout(delayTimer);
        delayTimer = setTimeout(function() {
           selectDcards(currentPageDcard);
        }, searchLatency);
    });

    //Admin workarea Tab-2 clear search input
    $(document).on('click', '.clear-srch-dcard', function(){
        $(this).parents('.input-group').find('.sav2-srch-dcard').val('');
        selectDcards(currentPageDcard);
		$(this).parents('.input-group').find('.sav2-srch-dcard').removeAttr('style');
    });
	
	//Admin workarea Tab-2 (delete dcard)
    $(document).on('click', '.sav2-del-dcard', function(){
        var delConfirm = confirm('Удалить данную карту под id: ' + $(this).attr('id'));
        if (delConfirm) {
			var currentdate = new Date(); 
			var datetime = "deletion timestamp: " + currentdate.getDate() + "-"
							+ (currentdate.getMonth()+1)  + "-" 
							+ currentdate.getFullYear() + " @ "  
							+ currentdate.getHours() + ":"  
							+ currentdate.getMinutes() + ":" 
							+ currentdate.getSeconds();
							
            doDelete('delete_dcard', 
				{
					id: $(this).attr('id'),
					changelog: '|'+ datetime +' by '+ $('#userinfo4').val().trim() + ' (id:'+ $('#userinfo4').attr('userid') +')'
				}, 
				'DCARD', 
				currentPageDcard);
        }
    });
	
	//Admin workarea Tab-2 (process dcards)
	//Admin workarea Tab-5 (process dcards)
    $(document).on('click', '.sav2-process-dcard', function () {
		//clear dcard forms
		for (var i=1; i<=18; i++) {
			$('#form'+i)[0].reset();
		}
		
        $('#dcardid').val($(this).attr('id')).trigger('input');
		
		$('#tabPre').trigger('click');
        $('#showTab3').trigger('click');
    });
	
	//Admin workarea Tab-2 (buttons .sav2-print-i-dcard -- print doc-file)
    $(document).on('click', '.sav2-print-i-dcard', function(){      			
		$('#printdcardidinput').val($(this).attr('id'));
		$('#printtypeinput').val('1');
		$('#printform').submit();	
    });
	
	//Admin workarea Tab-2 (buttons .sav2-print-ii-dcard -- print doc-file)
    $(document).on('click', '.sav2-print-ii-dcard', function(){      			
		$('#printdcardidinput').val($(this).attr('id'));
		$('#printtypeinput').val('2');
		$('#printform').submit();	
    });
	
	//Admin workarea Tab-2 (buttons .sav2-print-dcard -- print doc-file)
    $(document).on('click', '.sav2-print-dcard', function(){      			
		$('#printdcardidinput').val($(this).attr('id'));
		$('#printtypeinput').val('3');
		$('#printform').submit();	
    });
	
	/** -- TAB 3 -- **/
	//Admin workarea Tab-3
    //show up
    $(document).on('click', '#showTab3', function(){
		selectDcardByID($('#dcardid').val().trim());
    });
	
	//Admin workarea Tab-3 (#dcardid disabled input)
    $(document).on('input', '#dcardid', function(){
        $('#recordnew').attr('active', 'true');
		$('#recordnew').attr('data-target', '#writeDCard');
		$('#recordnew').removeClass('disabled');
		
		$('.dcard-print-doc').attr('active', 'true');
		$('.dcard-print-doc').removeClass('disabled');
    });
	
	//Admin workarea Tab-3 (buttons .dcard-print-doc -- print doc-file)
    $(document).on('click', '.dcard-print-doc', function(){
        if ($('#dcardid').val().trim() !== '') {
			
			var dcardID = $('#dcardid').val().trim();
			
			$('#printdcardidinput').val(dcardID);
			$('#printtypeinput').val($(this).attr('printtype'));
			$('#printform').submit();
		}
    });
	
	//Admin workarea Tab-3 (button #recordnew -- send record)
    $(document).on('click', '#recordnew', function(){
        $('#writeDCardID').empty();
        var htmlString = '';
		
		htmlString += 'id карты: <b>'+ $('#dcardid').val() +'</b>';

        $('#writeDCardID').html(htmlString);
    });

    //Admin workarea Tab-3 (button #writeDCardYes -- send record MODAL)
    $(document).on('click', '#writeDCardYes', function(){
		
		if ($('#dcardid').val().trim() !== '') {
			updateDcard();
		}
    });
	
    /** -- TAB 4 -- **/
	//Admin workarea Tab-4
    //show up
    $(document).on('click', '#showTab4', function(){
        selectUsers(currentPageUser);
    });
    
    //Admin workarea Tab-4 search
    $(document).on('input', '.sav2-srch-user', function(){
        clearTimeout(delayTimer);
        delayTimer = setTimeout(function() {
           selectUsers(currentPageUser);
        }, searchLatency);
    });

    //Admin workarea Tab-4 clear search input
    $(document).on('click', '.clear-srch-user', function(){
        $(this).parents('.input-group').find('.sav2-srch-user').val('');
        selectUsers(currentPageUser);
    });
    
    //Admin workarea Tab-4 unlock user
    $(document).on('click', '.sav2-unlock-user', function(){
        doUpdate('unlock_user',
            {
                id: $(this).attr('id')  
            },
            function() {selectUsers(currentPageUser);}
        );
    });
    
    //Admin workarea Tab-4 lock user
    $(document).on('click', '.sav2-lock-user', function(){
        doUpdate('lock_user',
            {
                id: $(this).attr('id')  
            },
            function() {selectUsers(currentPageUser);}
        );
    });
    
    //Admin workarea Tab-4 update user
    $(document).on('click', '.sav2-upd-user', function(){
        loadUpdateForm($(this).attr('id'), 'update_user_modal');
    });
	
	//Admin workarea Tab-4 insert new user
    $(document).on('click', '#addnewuser', function () {
        loadInsertForm(0, 0, 'insert_user_modal');
    });
	
	/** -- TAB 5 -- **/
    //Admin workarea Tab-5
    //show up
    $(document).on('click', '#showTab5', function(){
        validateDcards(currentPageValidateDcard);
    });
	
});
