var detuneMultipliers = [-1,1];
var context = new AudioContext();
var tonic;
var cents;
var freqs = [440, 466.164, 493.883, 523.252, 554.366, 293.665, 311.127, 329.628, 349.228, 369.994, 391.995, 415.305];
var notes = ["A", "A#/Bb", "B",     "C",     "C#/Db", "D",     "D#/Eb", "E",     "F",     "F#/Gb", "G",     "G#"];
var detuneMultiplier;
var antislack = .5;
var slack = 25;

//timbre
var real = new Float32Array(9);
real[0] = 0;
real[1] = 1;
real[2] = 2;
real[3] = 4;
real[4] = 8;
real[5] = 16;
real[6] = 32;
real[7] = 64;
real[8] = 128;
var img = new Float32Array(9);
img[0] = 0;
img[1] = 1;
img[2] = 2;
img[3] = 4;
img[4] = 8;
img[5] = 16;
img[6] = 32;
img[7] = 64;
img[8] = 128;
var myInstrument = context.createPeriodicWave(real, img);

$(function(){
	if(localStorage.getItem("bestCents")){
		cents = parseInt(localStorage.getItem("bestCents"))+slack;
	}
	else{
		cents = 100;
	}

	init();

	$("#playPair").on("click", function(){
		playPair(tonic, cents);
	});

	$("#higher").on("click", function(){
		guessedHigher();
	});
	$("#lower").on("click", function(){
		guessedLower();
	});
});

function playPair(tonic, cents){
	var rest = .25;
	var duration = .5;

	var tonicGain = context.createGain();
	tonicGain.connect(context.destination);
	tonicGain.gain.value = 0;
	var secondGain = context.createGain();
	secondGain.connect(context.destination);
	secondGain.gain.value = 0;

	var tonicOsc = context.createOscillator();
	tonicOsc.frequency.value = tonic;
	tonicOsc.connect(tonicGain);
	tonicOsc.setPeriodicWave(myInstrument);
	var secondOsc = context.createOscillator();
	secondOsc.frequency.value = tonic;
	secondOsc.detune.value = cents;
	secondOsc.connect(secondGain);
	secondOsc.setPeriodicWave(myInstrument);

	//console.log("tonicOsc.frequency.value: "+tonicOsc.frequency.value);
	//console.log("secondOsc.frequency.value: "+secondOsc.frequency.value);
	console.log("secondOsc.detune.value: "+secondOsc.detune.value);

	var now = context.currentTime;
	tonicOsc.start(context.currentTime);
	tonicGain.gain.linearRampToValueAtTime(0, context.currentTime);
	tonicGain.gain.linearRampToValueAtTime(1, context.currentTime+(duration*.1));
	tonicGain.gain.linearRampToValueAtTime(.8, context.currentTime+(duration*.2));
	tonicGain.gain.linearRampToValueAtTime(.8, context.currentTime+(duration*.9));
	tonicGain.gain.linearRampToValueAtTime(0, context.currentTime+duration);
	tonicOsc.stop(context.currentTime+duration);
	secondOsc.start(context.currentTime+rest+duration);
	secondGain.gain.linearRampToValueAtTime(0, context.currentTime+rest+duration);
	secondGain.gain.linearRampToValueAtTime(1, context.currentTime+rest+duration+(duration*.1));
	secondGain.gain.linearRampToValueAtTime(.8, context.currentTime+rest+duration+(duration*.2));
	secondGain.gain.linearRampToValueAtTime(.8, context.currentTime+rest+duration+(duration*.9));
	secondGain.gain.linearRampToValueAtTime(0, context.currentTime+rest+duration+duration);
	secondOsc.stop(context.currentTime+rest+duration+duration);
}

function init(){
	var tonicIndex = Math.round(12*Math.random());//not amazing - probablility of 1 and 12 is small
	tonic = freqs[tonicIndex];
	$("#tonic").html(notes[tonicIndex]);
	$("#currentlyTesting").html(Math.abs(cents));
	detuneMultiplier = Math.round(Math.random());
	cents = cents * detuneMultipliers[detuneMultiplier];

	if(localStorage.getItem("bestCents")){
		$("#bestCents").html(localStorage.getItem("bestCents"));
	}
}

function guessedLower(){
	if(cents<0){
		//correct!
		console.log("correct");
		if(localStorage.getItem("bestCents")>Math.abs(cents)){
			localStorage.setItem("bestCents", Math.abs(cents));
		}
		cents = cents*.5;
	}
	else{
		//incorrect
		console.log("incorrect");
		cents = Math.abs(cents)+slack;
	}
	init();
}
function guessedHigher(){
	if(cents>0){
		//correct!
		console.log("correct");
		if(localStorage.getItem("bestCents")>Math.abs(cents)){
			localStorage.setItem("bestCents", Math.abs(cents));
		}
		cents = cents*.5;
	}
	else{
		//incorrect
		console.log("incorrect");
		cents = Math.abs(cents)+slack;
	}
	init();
}