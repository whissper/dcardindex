<input type="hidden" id="entity" value="patient" />
<div class="form-group">
	<label for="patientFioIns">ФИО:</label>
	<input type="text" class="form-control sav2-field-ins" id="patientFioIns" placeholder="ФИО">
</div>
<div class="form-group">
	<label for="patientBirthdateIns">Дата рождения:</label>
	<input type="text" class="form-control sav2-field-ins" id="patientBirthdateIns">
</div>
<div class="form-group">
	<label for="patientHeightIns">Рост:</label>
	<input type="text" class="form-control sav2-field-ins" id="patientHeightIns">
</div>
<div class="form-group">
	<label for="patientAmbnumIns">№ амбулаторной карты:</label>
	<input type="text" class="form-control sav2-field-ins" id="patientAmbnumIns">
</div>

<script>
	$('#patientHeightIns').inputmask({
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
	
	$('#patientBirthdateIns').datepicker({
		format: "dd-mm-yyyy",
		viewMode: "months", 
		minViewMode: "days",
		language: 'ru'
	});
</script>
