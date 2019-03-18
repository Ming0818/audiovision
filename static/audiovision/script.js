function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

image_lables = {}

function request_prediction(){
  const Http = new XMLHttpRequest();
  const url='http://127.0.0.1:5000/classify';
  Http.open("GET", url, true);
  Http.send();
  Http.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          obj = JSON.parse(Http.responseText);
          console.log(obj);

          clearUI()
          document.getElementById('prediction').innerHTML = ""
          if(obj.hasOwnProperty('img_lables'))
          {
            image_lables = obj.img_lables;
          }else
          {
            image_lables = {};
          }
          for (mic in obj)
          {   
            if( mic != 'img_lables')
            {
              document.getElementById('prediction').innerHTML += '<hr>'
              var predicted_speaker = "";
              var maxValue = 0;
              for (speaker in obj[mic])
              {
                  if (obj[mic][speaker] > maxValue)
                  {
                      predicted_speaker = speaker
                      maxValue = obj[mic][speaker];   
                  }
              }
              document.getElementById('prediction').innerHTML += '<b>' + mic + '</b> ' + ' confidence:<br>';
              document.getElementById(mic).textContent =(capitalizeFirstLetter(predicted_speaker));
              for (speaker in obj[mic])
              {   
                  if (speaker === predicted_speaker) 
                  {
                      document.getElementById('prediction').innerHTML += '&nbsp;&nbsp;<b>'+capitalizeFirstLetter(speaker) +': '+ (obj[mic][speaker]).toFixed(4) + '</b><br>';
                  }
                  else
                  {
                      document.getElementById('prediction').innerHTML += '&nbsp;&nbsp;' + capitalizeFirstLetter(speaker) +': '+ (obj[mic][speaker]).toFixed(4) + '</br>';
                  }
              }
            }
          }
          displayBuffer() 
      }
  }
}
var myVar = setInterval(request_prediction, 2000);

function showClearSpec()
{
  document.getElementById("source_spectrogram").style.display="none";
  document.getElementById("destination_spectrogram").style.display="block";
}

function showOriginSpec()
{
  document.getElementById("source_spectrogram").style.display="block";
  document.getElementById("destination_spectrogram").style.display="none";
}

function displayBuffer()
{
  document.getElementById("buffer_div").innerHTML = ""
  for (mic in image_lables)
  {
    document.getElementById("buffer_div").innerHTML += '<a>&nbsp;&nbsp;<b>' + mic + '</b> buffer: </a>';
    for (i = 0; i < 5; i++) { 
      image_name = "spectrogram_"+i+".jpg"
      var img = document.createElement("img");
      img.src = "real_time\\"+mic+"\\"+image_name;
      if(image_lables[mic] === image_name)
      {
        img.classList = "border border-danger";
      }
      document.getElementById("buffer_div").appendChild(img)
    }
    document.getElementById("buffer_div").innerHTML += "<br>"
  }
}

function clearUI()
{
    for (i =0; i<4; i++)
    {
        mic_name = "mic_" + i
        document.getElementById(mic_name).textContent =(mic_name);
    }
}