<div class="sav2-admin-wa">
<div class="row">
	<div class="col-md-12">
		<div class="btn-group" role="group">
			  <button type="button" class="btn btn-default active" id="showTab1">Пациенты</button>
			  <button type="button" class="btn btn-default" id="showTab2">Картотека</button>
			  <button type="button" class="btn btn-default" id="showTab3">Выбранная карта</button>
			  <button type="button" class="btn btn-default" id="showTab4" [@hide]>Пользователи</button>
			  <button type="button" class="btn btn-primary" id="logout">Выйти</button>
		</div>
	</div>
</div>

<br />

<div class="row">
	<div class="col-md-12" id="sav2-infobox-info">
				
	</div>
</div>

<!-- TAB 1 -->
<div class="row sav2-tabs sav2-tab1">	
	<div class="col-md-12">
		<div class="row">
			<div class="col-md-4">
				<div class="input-group">
					<span class="input-group-addon"><i class="fas fa-user-md"></i> Сотрудник: </span>
					<input id="userinfo1" type="text" class="form-control" value="[@userfio]" userid="[@userid]" disabled="">
				</div>
				<br />
			</div>
			<div class="col-md-4">
				<button class="btn btn-primary" data-toggle="modal" data-target="#insertElement" id="addnewpatient"><i class="fas fa-address-card"></i> Завести пациента </button>
			</div>				
		</div>
		<hr />
		<p>Поиск пациентов:</p>
		<div class="row">
			<div class="col-md-4 col-srch">
				<div class="input-group">
					<span class="input-group-addon">id пациента: </span>
					<input type="text" class="form-control sav2-srch-patient" id="srch-patient-id">
					<span class="input-group-btn">
						<button class="btn btn-default clear-srch-patient" title="Очистить" id="clear-srch-patient-id">
							<span class="glyphicon glyphicon-remove"></span>
						</button>
					</span>
				</div>
			</div>
			<div class="col-md-4 col-srch">
				<div class="input-group">
					<span class="input-group-addon">№ амб. карты: </span>
					<input type="text" class="form-control sav2-srch-patient" id="srch-patient-ambnum">
					<span class="input-group-btn">
						<button class="btn btn-default clear-srch-patient" title="Очистить" id="clear-srch-patient-ambnum">
							<span class="glyphicon glyphicon-remove"></span>
						</button>
					</span>
				</div>
			</div>
			<div class="col-md-4 col-srch">
				<div class="input-group">
					<span class="input-group-addon">Дата рождения: </span>
					<input type="text" class="form-control sav2-srch-patient" id="srch-patient-birthdate">
					<span class="input-group-btn">
						<button class="btn btn-default clear-srch-patient" title="Очистить" id="clear-srch-patient-birthdate">
							<span class="glyphicon glyphicon-remove"></span>
						</button>
					</span>
				</div>
			</div>
			<div class="col-md-8 col-srch">
				<div class="input-group">
					<span class="input-group-addon">ФИО пациента: </span>
					<input type="text" class="form-control sav2-srch-patient" id="srch-patient-fio">
					<span class="input-group-btn">
						<button class="btn btn-default clear-srch-patient" title="Очистить" id="clear-srch-patient-fio">
							<span class="glyphicon glyphicon-remove"></span>
						</button>
					</span>
				</div>
			</div>
		</div>
		<hr />
		<p>Список записей:</p>
		<div class="sav2-edit-patient-table">
		<!-- DYNAMIC start: -->
		
		<!-- DYNAMIC end; -->
		</div>
	</div>
</div>

<!-- TAB 2 -->
<div class="row sav2-tabs sav2-tab2">
	<div class="col-md-12">
		<div class="row">
			<div class="col-md-4">
				<div class="input-group">
					<span class="input-group-addon"><i class="fas fa-user-md"></i> Сотрудник: </span>
					<input id="userinfo2" type="text" class="form-control" value="[@userfio]" userid="[@userid]" disabled="">
				</div>
				<br />
			</div>		
		</div>
		<hr />
		<p>Поиск карт:</p>
		<div class="row">
			<div class="col-md-3 col-srch">
				<div class="input-group">
					<span class="input-group-addon">id карты: </span>
					<input type="text" class="form-control sav2-srch-dcard" id="srch-dcard-id">
					<span class="input-group-btn">
						<button class="btn btn-default clear-srch-dcard" title="Очистить" id="clear-srch-dcard-id">
							<span class="glyphicon glyphicon-remove"></span>
						</button>
					</span>
				</div>
			</div>
			<div class="col-md-3 col-srch">
				<div class="input-group">
					<span class="input-group-addon">id пациента: </span>
					<input type="text" class="form-control sav2-srch-dcard" id="srch-dcard-patientid">
					<span class="input-group-btn">
						<button class="btn btn-default clear-srch-dcard" title="Очистить" id="clear-srch-dcard-patientid">
							<span class="glyphicon glyphicon-remove"></span>
						</button>
					</span>
				</div>
			</div>
			<div class="col-md-6 col-srch">
				<div class="input-group">
					<span class="input-group-addon">№ амб. карты пациента: </span>
					<input type="text" class="form-control sav2-srch-dcard" id="srch-dcard-patientambnum">
					<span class="input-group-btn">
						<button class="btn btn-default clear-srch-dcard" title="Очистить" id="clear-srch-dcard-patientambnum">
							<span class="glyphicon glyphicon-remove"></span>
						</button>
					</span>
				</div>
			</div>
			<div class="col-md-6 col-srch">
				<div class="input-group">
					<span class="input-group-addon">дата процедуры: </span>
					<input type="text" class="form-control sav2-srch-dcard" id="srch-dcard-date">
					<span class="input-group-btn">
						<button class="btn btn-default clear-srch-dcard" title="Очистить" id="clear-srch-dcard-date">
							<span class="glyphicon glyphicon-remove"></span>
						</button>
					</span>
				</div>
			</div>
			<div class="col-md-6 col-srch">
				<div class="input-group">
					<span class="input-group-addon">ФИО пациента: </span>
					<input type="text" class="form-control sav2-srch-dcard" id="srch-dcard-patientfio">
					<span class="input-group-btn">
						<button class="btn btn-default clear-srch-dcard" title="Очистить" id="clear-srch-dcard-patientfio">
							<span class="glyphicon glyphicon-remove"></span>
						</button>
					</span>
				</div>
			</div>
		</div>
		<hr />
		<p>Список записей:</p>
		<div class="sav2-edit-dcard-table">
		<!-- DYNAMIC start: -->
		
		<!-- DYNAMIC end; -->
		</div>
	</div>
</div>

<!-- TAB 3 -->
<div class="row sav2-tabs sav2-tab3">
	<div class="col-md-12">
		
		<div class="row">
			<div class="col-md-4">
				<div class="input-group">
					<span class="input-group-addon"><i class="fas fa-user-md"></i> Сотрудник: </span>
					<input id="userinfo3" type="text" class="form-control" value="[@userfio]" userid="[@userid]" disabled="">
				</div>
				<br />
			</div>
			<div class="col-md-4">
				<form id="printform" action="/dcard/print_dcard/" method="post" target="_blank">
					<input id="printdcardidinput" name="id" type="hidden" value="">
					<input id="printtypeinput" name="printtype" type="hidden" value="">
				</form>
				<button title="Печать первой части" class="btn btn-primary disabled dcard-print-doc" printtype="1" active="false"><i class="fas fa-file-word"></i> I</button>
				<button title="Печать второй части" class="btn btn-primary disabled dcard-print-doc" printtype="2" active="false"><i class="fas fa-file-word"></i> II</button>
				<button title="Печать всей карты" class="btn btn-primary disabled dcard-print-doc" printtype="3" active="false"><i class="fas fa-file-word"></i> I+II</button>
			</div>				
		</div>
		
		<div class="row">
			<div class="col-md-12">
				<h3>Карта процедуры:</h3>
			</div>
		</div>
		<!-- D-CARD-FORM (start) -->
		<div class="row">
			<div class="col-md-3">
				<form id="form1" class="well well-sav2 form-horizontal">
					<fieldset>
						<div class="form-group form-group-sm">
							<label class="col-md-3 control-label">Дата:</label>
							<div class="col-md-9">
								<div class="input-group input-group-sm">
									<span class="input-group-addon"><i class="far fa-circle"></i></span>
									<input id="d6" class="form-control" type="text">
								</div>
							</div>
						</div>
					</fieldset>
				</form>
			</div>
			<div class="col-md-3">
				<form id="form2" class="well well-sav2 form-horizontal">
					<fieldset>
						<div class="form-group form-group-sm">
							<label class="col-md-6 control-label">Процедура:</label>
							<div class="col-md-6">
								<select class="form-control" id="d0">
									<option value="1">ГД</option>
									<option value="2">ГДФ</option>
								</select>
							</div>
						</div>
					</fieldset>
				</form>
			</div>
			<div class="col-md-3">
				<form id="form3" class="well well-sav2 form-horizontal">
					<fieldset>
						<div class="form-group form-group-sm">
							<label class="col-md-3 control-label">id карты:</label>
							<div class="col-md-9">
								<div class="input-group input-group-sm">
									<span class="input-group-addon"><i class="far fa-circle"></i></span>
									<input id="dcardid" class="form-control" type="text" placeholder="" disabled>
								</div>
							</div>
						</div>
					</fieldset>
				</form>
			</div>				
		</div>		
		
		<div class="row">
			<div class="col-md-6">		
				
				<form id="form4" class="well well-sav2 form-horizontal">
					<fieldset>
						<div class="form-group form-group-sm">
							<label class="col-md-2 control-label">id пациента:</label>
							<div class="col-md-10">
								<div class="input-group input-group-sm">
									<span class="input-group-addon"><i class="far fa-circle"></i></span>
									<input id="dpatientid" class="form-control" type="text" placeholder="" disabled>
								</div>
							</div>
						</div>
						<div class="form-group form-group-sm">
							<label class="col-md-2 control-label">Пациент:</label>
							<div class="col-md-10">
								<div class="input-group input-group-sm">
									<span class="input-group-addon"><i class="far fa-circle"></i></span>
									<input id="d1" class="form-control" type="text" placeholder="" disabled>
								</div>
							</div>
						</div>
						<div class="form-group form-group-sm">
							<label class="col-md-2 control-label">Зал:</label>
							<div class="col-md-10">
								<div class="input-group input-group-sm">
									<span class="input-group-addon"><i class="far fa-circle"></i></span>
									<input id="d5" class="form-control" type="text">
								</div>
							</div>
						</div>
					</fieldset>
				</form>
			
			</div>
			<div class="col-md-3">	
							
				<form  id="form5" class="well well-sav2 form-horizontal">
					<fieldset>
						<div class="form-group form-group-sm">
							<label class="col-md-3 control-label">Сухой вес:</label>
							<div class="col-md-9">
								<div class="input-group input-group-sm">
									<span class="input-group-addon"><i class="far fa-circle"></i></span>
									<input id="d2" class="form-control" type="text">
									<span class="input-group-addon">кг</span>
								</div>
							</div>
						</div>
						<div class="form-group form-group-sm">
							<label class="col-md-3 control-label">Рост:</label>
							<div class="col-md-9">
								<div class="input-group input-group-sm">
									<span class="input-group-addon"><i class="far fa-circle"></i></span>
									<input id="d3" class="form-control" type="text" placeholder="" disabled>
									<span class="input-group-addon">см</span>
								</div>
							</div>
						</div>
						<div class="form-group form-group-sm">
							<label class="col-md-3 control-label">Возраст:</label>
							<div class="col-md-9">
								<div class="input-group input-group-sm">
									<span class="input-group-addon"><i class="far fa-circle"></i></span>
									<input id="d4" class="form-control" type="text" placeholder="" disabled>
								</div>
							</div>
						</div>
					</fieldset>
				</form>
			
			</div>
		</div>
				
		<div class="row">
			<div class="col-md-12">
				<ul class="nav nav-tabs">
					<li class="active"><a id="tabPre" data-toggle="tab" href="#beforeGD">До ГД</a></li>
					<li><a id="tabPost" data-toggle="tab" href="#afterGD">После ГД</a></li>
				</ul>
				<div class="tab-content">
					<div id="beforeGD" class="tab-pane fade in active">
						<hr/>
						<div class="row">
						<div class="col-md-4">
							<form id="form6" class="well well-sav2 form-horizontal">
								<fieldset>
									<div class="form-group form-group-sm">
										<label class="col-md-4 control-label">Аппарат::</label>
										<div class="col-md-8">
											<select class="form-control" id="d7">
												<option value="1">4008</option>
												<option value="2">5008</option>
											</select>
										</div>
									</div>
									<div class="form-group form-group-sm">
										<label class="col-md-4 control-label">Диализатор:</label>
										<div class="col-md-8">
											<select class="form-control" id="d8">
												<option value="1">Fx 60</option>
												<option value="2">Fx 80</option>
												<option value="3">Fx 100</option>
											</select>
										</div>
									</div>
									<div class="form-group form-group-sm">
										<label class="col-md-4 control-label">Время ГД:</label>
										<div class="col-md-8">
											<div class="input-group input-group-sm">
												<span class="input-group-addon"><i class="far fa-circle"></i></span>
												<input id="d9" class="form-control" type="text">
												<span class="input-group-addon">мин</span>
											</div>
										</div>
									</div>
								</fieldset>
							</form>
						</div>
						<div class="col-md-4">
							<form id="form7" class="well well-sav2 form-horizontal">
								<fieldset>
									<div class="form-group form-group-sm">
										<label class="col-md-4 control-label">Подача:</label>
										<div class="col-md-8">
											<div class="input-group input-group-sm">
												<span class="input-group-addon"><i class="far fa-circle"></i></span>
												<input id="d10" class="form-control" type="text">
												<span class="input-group-addon">мл/ч</span>
											</div>
										</div>
									</div>
									<div class="form-group form-group-sm">
										<label class="col-md-4 control-label">Диализат:</label>
										<div class="col-md-8">
											<select class="form-control" id="d11">
												<option value="1">ст</option>
												<option value="2">гл</option>
												<option value="3">са</option>
											</select>
										</div>
									</div>
									<div class="form-group form-group-sm">
										<label class="col-md-4 control-label">Поток ди-та/ф.поток:</label>
										<div class="col-md-8">
											<div class="input-group input-group-sm">
												<span class="input-group-addon"><i class="far fa-circle"></i></span>
												<input id="d12" class="form-control" type="text">
											</div>
										</div>
									</div>
								</fieldset>
							</form>
						</div>
						<div class="col-md-4">
							<form id="form8" class="well well-sav2 form-horizontal">
								<fieldset>
									<div class="form-group form-group-sm">
										<label class="col-md-4 control-label">Доза гепарина :</label>
										<div class="col-md-8">
											<div class="input-group input-group-sm">
												<span class="input-group-addon"><i class="far fa-circle"></i></span>
												<input id="d13" class="form-control" type="text">
												<span class="input-group-addon">ЕД</span>
											</div>
										</div>
									</div>
									<div class="form-group form-group-sm">
										<label class="col-md-4 control-label">Болюс:</label>
										<div class="col-md-8">
											<div class="input-group input-group-sm">
												<span class="input-group-addon"><i class="far fa-circle"></i></span>
												<input id="d14" class="form-control" type="text">
												<span class="input-group-addon">мл</span>
											</div>
										</div>
									</div>
									<div class="form-group form-group-sm">
										<label class="col-md-4 control-label">Вр. гепарин./оконч:</label>
										<div class="col-md-8">
											<div class="input-group input-group-sm">
												<span class="input-group-addon"><i class="far fa-circle"></i></span>
												<input id="d15" class="form-control" type="text">
											</div>
										</div>
									</div>
								</fieldset>
							</form>
						</div>
						<div class="col-md-4">
							<form id="form9" class="well well-sav2 form-horizontal">
								<fieldset>
									<div class="form-group form-group-sm">
										<label class="col-md-4 control-label">Бикарбонат:</label>
										<div class="col-md-8">
											<div class="input-group input-group-sm">
												<span class="input-group-addon"><i class="far fa-circle"></i></span>
												<input id="d16" class="form-control" type="text">
											</div>
										</div>
									</div>
									<div class="form-group form-group-sm">
										<label class="col-md-4 control-label">Na+:</label>
										<div class="col-md-8">
											<div class="input-group input-group-sm">
												<span class="input-group-addon"><i class="far fa-circle"></i></span>
												<input id="d17" class="form-control" type="text">
											</div>
										</div>
									</div>
									<div class="form-group form-group-sm">
										<label class="col-md-4 control-label">V-уф:</label>
										<div class="col-md-8">
											<div class="input-group input-group-sm">
												<span class="input-group-addon"><i class="far fa-circle"></i></span>
												<input id="d18" class="form-control" type="text">
											</div>
										</div>
									</div>
									<div class="form-group form-group-sm">
										<label class="col-md-4 control-label">Ск.К.:</label>
										<div class="col-md-8">
											<div class="input-group input-group-sm">
												<span class="input-group-addon"><i class="far fa-circle"></i></span>
												<input id="d19" class="form-control" type="text">
											</div>
										</div>
									</div>
								</fieldset>
							</form>
						</div>
						<div class="col-md-4">
							<form id="form10" class="well well-sav2 form-horizontal">
								<fieldset>
									<div class="form-group form-group-sm">
										<label class="col-md-4 control-label"></label>
										<div class="col-md-8">
											<input class="form-control" type="text" value="До ГД" disabled>
										</div>
									</div>
									<div class="form-group form-group-sm">
										<label class="col-md-4 control-label">Вес:</label>
										<div class="col-md-8">
											<div class="input-group input-group-sm">
												<span class="input-group-addon"><i class="far fa-circle"></i></span>
												<input id="d20" class="form-control" type="text">
											</div>
										</div>
									</div>
									<div class="form-group form-group-sm">
										<label class="col-md-4 control-label">АД:</label>
										<div class="col-md-8">
											<div class="input-group input-group-sm">
												<span class="input-group-addon"><i class="far fa-circle"></i></span>
												<input id="d21a" class="form-control" type="text">
												<span class="input-group-addon">/</span>
												<input id="d21b" class="form-control" type="text">
											</div>
										</div>
									</div>
									<div class="form-group form-group-sm">
										<label class="col-md-4 control-label">Пульс:</label>
										<div class="col-md-8">
											<div class="input-group input-group-sm">
												<span class="input-group-addon"><i class="far fa-circle"></i></span>
												<input id="d22" class="form-control" type="text">
											</div>
										</div>
									</div>
								</fieldset>
							</form>
						</div>
						<div class="col-md-12">
						
						</div>
						<div class="col-md-8">
							<form id="form11" class="well well-sav2 form-horizontal">
								<fieldset>
									<div class="form-group form-group-sm">
										<label class="col-md-2 control-label"></label>
										<div class="col-md-10">
											<input class="form-control" type="text" value="До ГД" disabled>
										</div>
									</div>
									<div class="form-group form-group-sm">
										<label class="col-md-2 control-label">Состояние:</label>
										<div class="col-md-10">
											<select class="form-control" id="d25">
												<option value="1">удовлетворительное</option>
												<option value="2">относительно удовлетворительное</option>
												<option value="3">средней тяжести</option>
												<option value="4">тяжелое</option>
											</select>
										</div>
									</div>
									<div class="form-group form-group-sm">
										<div class="col-md-12">
											<label class="checkbox-inline"><input type="checkbox" id="d23"> Жалобы</label>
											<label class="checkbox-inline"><input type="checkbox" id="d24"> Оттеки</label>
										</div>
									</div>
									<div class="form-group form-group-sm">
										<div class="col-md-12">
											<input class="form-control" type="text" value="Органы дыхания:" disabled>
										</div>
										<div class="col-md-12">
											<label class="checkbox-inline"><input type="checkbox" id="d26"> Изменения</label>
											<label class="checkbox-inline"><input type="checkbox" id="d27"> Хрипы</label>
										</div>
									</div>
									<div class="form-group form-group-sm">
										<div class="col-md-12">
											<input id="d28" class="form-control" type="text" placeholder="локализация">
										</div>
									</div>
									<div class="form-group form-group-sm">
										<label class="col-md-2 control-label">Тоны сердца:</label>
										<div class="col-md-10">
											<select class="form-control" id="d29">
												<option value="1">ритмичные</option>
												<option value="2">аритмичные</option>
											</select>
										</div>
									</div>
									<div class="form-group form-group-sm">
										<label class="col-md-2 control-label">Живот:</label>
										<div class="col-md-5">
											<select class="form-control" id="d30">
												<option value="1">мягкий</option>
												<option value="2">твердый</option>
											</select>
										</div>
										<div class="col-md-5">
											<select class="form-control" id="d31">
												<option value="1">безболезненный</option>
												<option value="2">болезненный</option>
											</select>
										</div>
									</div>
									<div class="form-group form-group-sm">
										<div class="col-md-12">
											<input id="d32" class="form-control" type="text" placeholder="локализация">
										</div>
									</div>
									<div class="form-group form-group-sm">
										<label class="col-md-2 control-label">Область AVF:</label>
										<div class="col-md-4">
											<select class="form-control" id="d33">
												<option value="1">без воспалений</option>
												<option value="2">воспалена</option>
											</select>
										</div>
										<label class="col-md-2 control-label">Шум AVF:</label>
										<div class="col-md-4">
											<select class="form-control" id="d34">
												<option value="1">удовлетворительное</option>
												<option value="2">ослабленное</option>
												<option value="3">не выслушивается</option>
											</select>
										</div>
									</div>
									<div class="form-group form-group-sm">
										<div class="col-md-12">
											<input id="d35" class="form-control" type="text" placeholder="доп. информация">
										</div>
									</div>

								</fieldset>
							</form>
						</div>
						<div class="col-md-12">
						
						</div>
						<div class="col-md-4">
							<form id="form12" class="well well-sav2 form-horizontal">
								<fieldset>
									<div class="form-group form-group-sm">
										<label class="col-md-2 control-label"></label>
										<div class="col-md-10">
											<input class="form-control" type="text" value="Назначения:" disabled>
										</div>
									</div>
									<div class="form-group form-group-sm">
										<div class="col-md-12">
											<div class="input-group input-group-sm">
												<span class="input-group-addon">Эпоэтин &alpha;</span>
												<input id="d36" class="form-control" type="text">
												<span class="input-group-addon">ME</span>
											</div>
										</div>
									</div>
									<div class="form-group form-group-sm">
										<div class="col-md-12">
											<div class="input-group input-group-sm">
												<span class="input-group-addon">Эпоэтин &beta;</span>
												<input id="d37" class="form-control" type="text">
												<span class="input-group-addon">ME</span>
											</div>
										</div>
									</div>
									<div class="form-group form-group-sm">
										<div class="col-md-12">
											<div class="input-group input-group-sm">
												<span class="input-group-addon">Аранесп</span>
												<input id="d38" class="form-control" type="text">
												<span class="input-group-addon">мкг</span>
											</div>
										</div>
									</div>
									<div class="form-group form-group-sm">
										<div class="col-md-12">
											<div class="input-group input-group-sm">
												<span class="input-group-addon">Мирцера</span>
												<input id="d39" class="form-control" type="text">
												<span class="input-group-addon">мкг</span>
											</div>
										</div>
									</div>
									<div class="form-group form-group-sm">
										<label class="col-md-6 control-label">Способ введения в конце ГД:</label>
										<div class="col-md-6">
											<select class="form-control" id="d40">
												<option value="1">подкожно</option>
												<option value="2">внутривенно</option>
											</select>
										</div>
									</div>
								</fieldset>
							</form>
						</div>
						<div class="col-md-4">
							<form id="form13" class="well well-sav2 form-horizontal">
								<fieldset>
									<div class="form-group form-group-sm">
										<label class="col-md-2 control-label"></label>
										<div class="col-md-10">
											<input class="form-control" type="text" value="Назначения:" disabled>
										</div>
									</div>
									<div class="form-group form-group-sm">
										<label class="col-md-12 control-label">в/в за 40 мин до окончания ГД дробно медленно:</label>
									</div>
									<div class="form-group form-group-sm">
										<div class="col-md-12">
											<div class="input-group input-group-sm">
												<span class="input-group-addon">Железа декстран</span>
												<input id="d41" class="form-control" type="text">
												<span class="input-group-addon">мг</span>
											</div>
										</div>
									</div>
									<div class="form-group form-group-sm">
										<div class="col-md-12">
											<div class="input-group input-group-sm">
												<span class="input-group-addon">Железа сахарат</span>
												<input id="d42" class="form-control" type="text">
												<span class="input-group-addon">мг</span>
											</div>
										</div>
									</div>
									<div class="form-group form-group-sm">
										<label class="col-md-12 control-label">в/в в конце ГД:</label>
									</div>
									<div class="form-group form-group-sm">
										<div class="col-md-12">
											<div class="input-group input-group-sm">
												<span class="input-group-addon">Витамин-C</span>
												<input id="d43" class="form-control" type="text">
												<span class="input-group-addon">мг</span>
											</div>
										</div>
									</div>
									<div class="form-group form-group-sm">
										<div class="col-md-12">
											<label class="checkbox-inline"><input type="checkbox" id="d44"> Витамин-B  500 мкг</label>
										</div>
									</div>
								</fieldset>
							</form>
						</div>
						</div>
					</div>
					
					<!-- Tabs border -->
					<div id="afterGD" class="tab-pane fade">						
						<hr/>
						<div class="row">
						<div class="col-md-4">
							<form id="form14" class="well well-sav2 form-horizontal">
								<fieldset>
									<div class="form-group form-group-sm">
										<label class="col-md-4 control-label"></label>
										<div class="col-md-8">
											<input class="form-control" type="text" value="После ГД" disabled>
										</div>
									</div>
									<div class="form-group form-group-sm">
										<label class="col-md-4 control-label">Вес:</label>
										<div class="col-md-8">
											<div class="input-group input-group-sm">
												<span class="input-group-addon"><i class="far fa-circle"></i></span>
												<input id="d45" class="form-control" type="text">
											</div>
										</div>
									</div>
									<div class="form-group form-group-sm">
										<label class="col-md-4 control-label">Удалено:</label>
										<div class="col-md-8">
											<div class="input-group input-group-sm">
												<span class="input-group-addon"><i class="far fa-circle"></i></span>
												<input id="d46" class="form-control" type="text" placeholder="" disabled>
											</div>
										</div>
									</div>
									<div class="form-group form-group-sm">
										<label class="col-md-4 control-label">АД:</label>
										<div class="col-md-8">
											<div class="input-group input-group-sm">
												<span class="input-group-addon"><i class="far fa-circle"></i></span>
												<input id="d47a" class="form-control" type="text">
												<span class="input-group-addon">/</span>
												<input id="d47b" class="form-control" type="text">
											</div>
										</div>
									</div>
									<div class="form-group form-group-sm">
										<label class="col-md-4 control-label">Пульс:</label>
										<div class="col-md-8">
											<div class="input-group input-group-sm">
												<span class="input-group-addon"><i class="far fa-circle"></i></span>
												<input id="d48" class="form-control" type="text">
											</div>
										</div>
									</div>
								</fieldset>
							</form>
						</div>
						<div class="col-md-4">
							<form id="form15" class="well well-sav2 form-horizontal">
								<fieldset>
									<div class="form-group form-group-sm">
										<label class="col-md-4 control-label">KT/V:</label>
										<div class="col-md-8">
											<div class="input-group input-group-sm">
												<span class="input-group-addon"><i class="far fa-circle"></i></span>
												<input id="d49" class="form-control" type="text">
											</div>
										</div>
									</div>
									<div class="form-group form-group-sm">
										<label class="col-md-4 control-label">V перф. крови:</label>
										<div class="col-md-8">
											<div class="input-group input-group-sm">
												<span class="input-group-addon"><i class="far fa-circle"></i></span>
												<input id="d50" class="form-control" type="text">
											</div>
										</div>
									</div>
									<div class="form-group form-group-sm">
										<label class="col-md-4 control-label">V замещения:</label>
										<div class="col-md-8">
											<div class="input-group input-group-sm">
												<span class="input-group-addon"><i class="far fa-circle"></i></span>
												<input id="d51" class="form-control" type="text">
											</div>
										</div>
									</div>
								</fieldset>
							</form>
						</div>
						<div class="col-md-4">
							<form id="form16" class="well well-sav2 form-horizontal">
								<fieldset>
									<div class="form-group form-group-sm">
										<label class="col-md-4 control-label">Глюкоза до ГД:</label>
										<div class="col-md-8">
											<div class="input-group input-group-sm">
												<span class="input-group-addon"><i class="far fa-circle"></i></span>
												<input id="d52" class="form-control" type="text">
											</div>
										</div>
									</div>
									<div class="form-group form-group-sm">
										<label class="col-md-4 control-label">Глюкоза после ГД:</label>
										<div class="col-md-8">
											<div class="input-group input-group-sm">
												<span class="input-group-addon"><i class="far fa-circle"></i></span>
												<input id="d53" class="form-control" type="text">
											</div>
										</div>
									</div>
									<div class="form-group form-group-sm">
										<label class="col-md-4 control-label">t тела:</label>
										<div class="col-md-8">
											<div class="input-group input-group-sm">
												<span class="input-group-addon"><i class="far fa-circle"></i></span>
												<input id="d54" class="form-control" type="text">
											</div>
										</div>
									</div>
								</fieldset>
							</form>
						</div>
						<div class="col-md-12">
						
						</div>
						<div class="col-md-8">
							<form id="form17" class="well well-sav2 form-horizontal">
								<fieldset>
									<div class="form-group form-group-sm">
										<label class="col-md-2 control-label"></label>
										<div class="col-md-10">
											<input class="form-control" type="text" value="После ГД" disabled>
										</div>
									</div>
									<div class="form-group form-group-sm">
										<label class="col-md-2 control-label">Состояние:</label>
										<div class="col-md-10">
											<select class="form-control" id="d60">
												<option value="1">удовлетворительное</option>
												<option value="2">относительно удовлетворительное</option>
												<option value="3">средней тяжести</option>
												<option value="4">тяжелое</option>
											</select>
										</div>
									</div>
									<div class="form-group form-group-sm">
										<div class="col-md-12">
											<label class="checkbox-inline"><input type="checkbox" id="d59"> Жалобы</label>
										</div>
									</div>
									<div class="form-group form-group-sm">
										<div class="col-md-12">
											<label class="checkbox-inline"><input type="checkbox" id="d61"> Течение ГД осложнения</label>
										</div>
									</div>
									<div class="form-group form-group-sm">
										<div class="col-md-12">
											<label class="checkbox-inline"><input type="checkbox" id="d62"> Требуется изменение терапии и диализной программы</label>
										</div>
									</div>
									<div class="form-group form-group-sm">
										<div class="col-md-12">
											<input id="d63" class="form-control" type="text" placeholder="доп. информация">
										</div>
									</div>
								</fieldset>
							</form>
						</div>
						<div class="col-md-4">
							<form id="form18" class="well well-sav2 form-horizontal">
								<fieldset>
									<div class="form-group form-group-sm">
										<label class="col-md-4 control-label"></label>
										<div class="col-md-8">
											<input class="form-control" type="text" value="Электролиты" disabled>
										</div>
									</div>
									<div class="form-group form-group-sm">
										<label class="col-md-4 control-label">Ca++:</label>
										<div class="col-md-8">
											<div class="input-group input-group-sm">
												<span class="input-group-addon"><i class="far fa-circle"></i></span>
												<input id="d55" class="form-control" type="text">
											</div>
										</div>
									</div>
									<div class="form-group form-group-sm">
										<label class="col-md-4 control-label">K+:</label>
										<div class="col-md-8">
											<div class="input-group input-group-sm">
												<span class="input-group-addon"><i class="far fa-circle"></i></span>
												<input id="d56" class="form-control" type="text">
											</div>
										</div>
									</div>
									<div class="form-group form-group-sm">
										<label class="col-md-4 control-label">Na+:</label>
										<div class="col-md-8">
											<div class="input-group input-group-sm">
												<span class="input-group-addon"><i class="far fa-circle"></i></span>
												<input id="d57" class="form-control" type="text">
											</div>
										</div>
									</div>
									<hr/>
									<div class="form-group form-group-sm">
										<div class="col-md-12">
											<div class="input-group input-group-sm">
												<span class="input-group-addon">ЭКГ:</span>
												<input id="d58" class="form-control" type="text">
											</div>
										</div>
									</div>
								</fieldset>
							</form>
						</div>
						</div>					
					</div>
				</div>
			</div>
		</div>
		<!-- D-CARD-FORM (end) -->
		
		<div class="col-md-12">
			<div class="col-md-12">
				<hr />
			</div>
			<div class="col-md-12">
				<button class="btn btn-lg btn-primary btn-block disabled" data-toggle="modal" data-target="" id="recordnew" active="false">Записать</button>
			</div>
		</div>
		
		<!-- Modal -->
		<div id="writeDCard" class="modal fade" role="dialog">
		  <div class="modal-dialog">
			<!-- Modal content-->
			<div class="modal-content">
			  <div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">&times;</button>
				<h4 class="modal-title">Запись данных:</h4>
			  </div>
			  <div class="modal-body">
				<p>Произвести запись изменений по карте?</p>
				<p id="writeDCardID"></p>
			  </div>
			  <div class="modal-footer">
				<button type="button" class="btn btn-default" data-dismiss="modal" id="writeDCardYes">Записать</button>
				<button type="button" class="btn btn-default" data-dismiss="modal" id="writeDCardNo">Отмена</button>
			  </div>
			</div>

		  </div>
		</div>
		
	</div>
</div>

<!-- TAB 4 -->
<div class="row sav2-tabs sav2-tab4">	
	<div class="col-md-12">
		<div class="row">
			<div class="col-md-4">
				<div class="input-group">
					<span class="input-group-addon"><i class="fas fa-user-md"></i> Сотрудник: </span>
					<input id="userinfo4" type="text" class="form-control" value="[@userfio]" userid="[@userid]" disabled="">
				</div>
				<br />
			</div>
			<div class="col-md-4">
				<button class="btn btn-primary" data-toggle="modal" data-target="#insertElement" id="addnewuser"><i class="fas fa-user-plus"></i> Добавить пользователя </button>
			</div>			
		</div>
		<hr />
		<p>Поиск пользователей:</p>
		<div class="row">
			<div class="col-md-6 col-srch">
				<div class="input-group">
					<span class="input-group-addon">ФИО пользователя: </span>
					<input type="text" class="form-control sav2-srch-user" id="srch-user-fio">
					<span class="input-group-btn">
						<button class="btn btn-default clear-srch-user" title="Очистить" id="clear-srch-user-fio">
							<span class="glyphicon glyphicon-remove"></span>
						</button>
					</span>
				</div>
			</div>
		</div>
		<hr />
		<p>Список записей:</p>
		<div class="sav2-edit-user-table">
		<!-- DYNAMIC start: -->
		
		<!-- DYNAMIC end; -->
		</div>
	</div>
</div>

<!-- TAB 7 -->
<div class="row sav2-tabs sav2-tab7">

</div>

<!-- Modal -->
<div id="updateElement" class="modal fade" role="dialog">
  <div class="modal-dialog">
	<!-- Modal content-->
	<div class="modal-content">
	  <div class="modal-header">
		<button type="button" class="close" data-dismiss="modal">&times;</button>
		<h4 class="modal-title"></h4>
	  </div>
	  <div class="modal-body">
		<p></p>
		<div id="elementDataUpd">
				
		</div>
	  </div>
	  <div class="modal-footer">
		<button type="button" class="btn btn-default" data-dismiss="modal" id="updElementYes">Сохранить</button>
		<button type="button" class="btn btn-default" data-dismiss="modal" id="updElementNo">Отмена</button>
	  </div>
	</div>

  </div>
</div>

<!-- Modal -->
<div id="insertElement" class="modal fade" role="dialog">
  <div class="modal-dialog">
	<!-- Modal content-->
	<div class="modal-content">
	  <div class="modal-header">
		<button type="button" class="close" data-dismiss="modal">&times;</button>
		<h4 class="modal-title"></h4>
	  </div>
	  <div class="modal-body">
		<p></p>
		<div id="elementDataIns">
				
		</div>
	  </div>
	  <div class="modal-footer">
		<button type="button" class="btn btn-default" data-dismiss="modal" id="insElementYes">Добавить</button>
		<button type="button" class="btn btn-default" data-dismiss="modal" id="insElementNo">Отмена</button>
	  </div>
	</div>

  </div>
</div>

</div>
<br />
<br />
<script>
	
	$.each(
		[
			'#srch-patient-birthdate',
			'#srch-dcard-date',
			'#d6'
		], 
		function(index, value) { 
			$(value).datepicker({
				format: "dd-mm-yyyy",
				viewMode: "months", 
				minViewMode: "days",
				language: 'ru'
			});
    });
	
	$.each(
		[
			'#srch-patient-id',
			'#srch-dcard-id',
			'#srch-dcard-patientid',
			'#d9',
			'#d12',
			'#d15',
			'#d16',
			'#d17',
			'#d18',
			'#d19',
			'#d21a',
			'#d21b',
			'#d22',
			'#d36',
			'#d37',
			'#d38',
			'#d39',
			'#d41',
			'#d42',
			'#d43',
			'#d47a',
			'#d47b',
			'#d48'
		], 
		function(index, value) { 
			$(value).inputmask({mask: "9{0,}", greedy: false});
    });
	
	$.each(
		[
			'#d2',
			'#d20',
			'#d45'
		], 
		function(index, value) { 
			$(value).inputmask({
				mask: "9{0,3}[.9{0,2}]", 
				greedy: false,
				oncomplete: function(){
					if ($(this).val().trim() === '.') {
						$(this).val('0.');
					}
				},
				onincomplete: function(){
					if ($(this).val().trim() === '.') {
						$(this).val('0.');
					}
				}
			});
    });
	
	$('#d54').inputmask({
				mask: "9{0,2}[.9{0,1}]", 
				greedy: false,
				oncomplete: function(){
					if ($(this).val().trim() === '.') {
						$(this).val('0.');
					}
				},
				onincomplete: function(){
					if ($(this).val().trim() === '.') {
						$(this).val('0.');
					}
				}
			});
	
	$.each(
		[
			'#d10',
			'#d13',
			'#d14',
			'#d49',
			'#d50',
			'#d51',
			'#d52',
			'#d53',
			'#d55',
			'#d56',
			'#d57'
		], 
		function(index, value) { 
			$(value).inputmask({
				mask: "9{0,5}[.9{0,2}]", 
				greedy: false,
				oncomplete: function(){
					if ($(this).val().trim() === '.') {
						$(this).val('0.');
					}
				},
				onincomplete: function(){
					if ($(this).val().trim() === '.') {
						$(this).val('0.');
					}
				}
			});
    });
	
</script>