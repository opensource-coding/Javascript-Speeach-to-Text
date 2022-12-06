const file = document.querySelector("#file"),
  recordBtn = document.querySelector(".record"),
  result = document.querySelector(".result");

file.addEventListener("change", function () {
  const reader = new FileReader();
  reader.addEventListener("load", function () {
    console.log(reader.result);
  });
  reader.readAsText(this.files[0]);
});

let allow = true,
  recording = false;
function speechToText() {
  try {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    2;
    if (allow) {
      recognition.start();
      recording = true;
    } else {
      recognition.stop();
      recording = false;
      return;
    }
    recordBtn.classList.add("recording");
    recordBtn.querySelector("p").innerHTML = "Recording...";
    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      //detect when intrim results
      if (event.results[0].isFinal) {
        result.innerHTML += " " + speechResult;
        result.querySelector("p").remove();
      } else {
        //creative p with class interim if not already there
        if (!document.querySelector(".interim")) {
          const interim = document.createElement("p");
          interim.classList.add("interim");
          result.appendChild(interim);
        }
        //update the interim p with the speech result
        document.querySelector(".interim").innerHTML = " " + speechResult;
      }
    };
    recognition.onspeechend = () => {
      recordBtn.querySelector("p").innerHTML = "Start Recording";
      recordBtn.classList.remove("recording");
      speechToText();
    };
    recognition.onerror = (event) => {
      recordBtn.querySelector("p").innerHTML = "Start Recording";
      recordBtn.classList.remove("recording");
      if (event.error === "no-speech") {
        console.log("No speech was detected. Try again.");
      } else {
        console.log("Error occurred in recognition: " + event.error);
      }
    };
  } catch (error) {
    console.log(error);
  }
}

recordBtn.addEventListener("click", () => {
  if (!recording) {
    allow = true;
    speechToText();
  } else {
    allow = false;
    speechToText();
  }
});
