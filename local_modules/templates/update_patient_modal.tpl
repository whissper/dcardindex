<input type="hidden" id="entity" />
<input type="hidden" id="idUpd" />

<div class="form-group">
	<label for="patientFioUpd">ФИО:</label>
	<input type="text" class="form-control sav2-field-ins" id="patientFioUpd" placeholder="ФИО">
</div>
<div class="form-group">
	<label for="patientBirthdateUpd">Дата рождения:</label>
	<input type="text" class="form-control sav2-field-ins" id="patientBirthdateUpd">
</div>
<div class="form-group">
	<label for="patientHeightUpd">Рост:</label>
	<input type="text" class="form-control sav2-field-ins" id="patientHeightUpd">
</div>
<div class="form-group">
	<label for="patientAmbnumUpd">№ амбулаторной карты:</label>
	<input type="text" class="form-control sav2-field-ins" id="patientAmbnumUpd">
</div>

<script>
	$('#patientHeightUpd').inputmask({
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
	
	$('#patientBirthdateUpd').datepicker({
		format: "dd-mm-yyyy",
		viewMode: "months", 
		minViewMode: "days",
		language: 'ru'
	});
</script>
