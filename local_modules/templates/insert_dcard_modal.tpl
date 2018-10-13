<input type="hidden" id="entity" value="dcard" />
<div class="form-group">
	<label for="patientIDIns">id пациента:</label>
	<input type="text" class="form-control sav2-field-ins" id="patientIDIns" placeholder="" disabled>
</div>
<div class="form-group">
	<label for="patientFioIns">ФИО пациента:</label>
	<input type="text" class="form-control sav2-field-ins" id="patientFioIns" placeholder="" disabled>
</div>
<div class="form-group">
	<label for="dcardProcDateIns">Дата процедуры:</label>
	<input type="text" class="form-control sav2-field-ins" id="dcardProcDateIns">
</div>
<div class="form-group">
	<label for="dcardProcTypeIns">Вид процедуры:</label>
	<select class="form-control" id="dcardProcTypeIns">
		<option value="1">ГД</option>
		<option value="2">ГДФ</option>
	</select>
</div>

<script>	
	$('#dcardProcDateIns').datepicker({
		format: "dd-mm-yyyy",
		viewMode: "months", 
		minViewMode: "days",
		language: 'ru'
	});
</script>
