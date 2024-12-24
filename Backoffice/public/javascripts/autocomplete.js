const autocompleteInput = new autocomplete.GeocoderAutocomplete(
  document.getElementById('autocomplete'), 
  '67de5a7dbcf741a3a569d157dd882274', 
  {
    placeholder: 'Insira a localização',
    lang: 'pt',
    limit: 5,
  }
);

autocompleteInput.addFilterByCountry(['pt']);

  
autocompleteInput.on('select', (location) => {
  console.log(location);
  document.getElementById('location').value = location.properties.address_line2;
  document.getElementById('place_id').value = location.properties.place_id;
  document.getElementById('street').value = location.properties.street;
  document.getElementById('country').value = location.properties.country;
  document.getElementById('city').value = location.properties.city;
  document.getElementById('district').value = location.properties.county;
  document.getElementById('code').value = location.properties.postcode;
  document.getElementById('website').value = location.properties.datasource.raw["heritage:website"];
  document.getElementById('heritage').value = location.properties.datasource.raw.protection_title;
  document.getElementById('formatted').value = location.properties.formatted;
  document.getElementById('lon').value = location.properties.lon;
  document.getElementById('lat').value = location.properties.lat;
});



