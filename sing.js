var freqs = [440, 466.164, 493.883, 523.252, 554.366, 293.665, 311.127, 329.628, 349.228, 369.994, 391.995, 415.305];
var notes = ["A", "A#/Bb", "B",     "C",     "C#/Db", "D",     "D#/Eb", "E",     "F",     "F#/Gb", "G",     "G#"];

var targetSing = 220;
var audioContext = new AudioContext();
var detector;
var timeOnNote = 3;//seconds
var startedHittingAt=0;
var hitting = false;

$(function(){
	$("#targetSing").html(targetSing);

	detector = new PitchDetector({
	    // Audio Context (Required)
	    context: audioContext,

	    // Input AudioNode (Required)
	    //input: null, // default: Microphone input

	    // Output AudioNode (Optional)
	    //output: AudioNode, // default: no output

	    // interpolate frequency (Optional)
	    //
	    // Auto-correlation is calculated for different (discrete) signal periods
	    // The true frequency is often in-beween two periods.
	    //
	    // We can interpolate (very hacky) by looking at neighbours of the best 
	    // auto-correlation period and shifting the frequency a bit towards the
	    // highest neighbour.
	    interpolateFrequency: true, // default: true

	    // Callback on pitch detection (Optional)
	    onDetect: function(stats, pitchDetector) { 
	        stats.frequency // 440
	        stats.detected // --> true
	        stats.worst_correlation // 0.03 - local minimum, not global minimum!
	        stats.best_correlation // 0.98
	        stats.worst_period // 80
	        stats.best_period // 100
	        stats.time // 2.2332 - audioContext.currentTime
	        stats.rms // 0.02 

	        if(stats.detected){
	        	//var pitch = constrainPitch();
	        	$("#currentSing").html(stats.frequency);
	        	if((Math.round(stats.frequency) == Math.round(targetSing)) || (Math.round(stats.frequency)+2 == Math.round(targetSing)) || (Math.round(stats.frequency)-2 == Math.round(targetSing))){
	        		if(!hitting){
	        			hitting = true;
	        			console.log("hitting: "+audioContext.currentTime);
	        			startedHittingAt = audioContext.currentTime;
	        		}
	        		if(hitting && ((startedHittingAt+timeOnNote) < audioContext.currentTime)){
	        			targetSing = targetSing*Math.pow(2, (1/24));
	        			console.log("pitch increase: "+audioContext.currentTime);
	        			hitting = false;
		        		$("#targetSing").html(targetSing);
	        		}
	        	}
	        }
	    },

	    // Debug Callback for visualisation (Optional)
	    onDebug: function(stats, pitchDetector) { },

	    // Minimal signal strength (RMS, Optional)
	    minRms: 0.01,

	    // Detect pitch only with minimal correlation of: (Optional)
	    minCorrelation: 0.9,

	    // Detect pitch only if correlation increases with at least: (Optional)
	    //minCorreationIncrease: 0.5,

	    // Note: you cannot use minCorrelation and minCorreationIncrease
	    // at the same time!

	    // Signal Normalization (Optional)
	    normalize: "rms", // or "peak". default: undefined

	    // Only detect pitch once: (Optional)
	    stopAfterDetection: false,

	    // Buffer length (Optional)
	    length: 1024, // default 1024

	    // Limit range (Optional):
	    //minNote: 69, // by MIDI note number
	    //maxNote: 80, 

	    minFrequency: 80,    // by Frequency in Hz
	    maxFrequency: 20000,

	    minPeriod: 2,  // by period (i.e. actual distance of calculation in audio buffer)
	    maxPeriod: 512, // --> convert to frequency: frequency = sampleRate / period

	    // Start right away
	    start: true // default: false
	});
});

function constrainPitch(freq){
	var pitch = "H";
	//can I use array.min and array.max?
	if(freq > 554.366) freq = freq/2.0;
	if(freq > 293.665) freq = freq*2.0;
	if(freq > 293.665 && freq < 554.366){
		//really?
		if(freq >= freqs[0] && freq < freqs[1]) pitch = notes[0];
		if(freq >= freqs[1] && freq < freqs[2]) pitch = notes[1];
		if(freq >= freqs[2] && freq < freqs[3]) pitch = notes[2];
		if(freq >= freqs[3] && freq < freqs[4]) pitch = notes[3];
		if(freq >= freqs[4] && freq < freqs[5]) pitch = notes[4];
		if(freq >= freqs[5] && freq < freqs[6]) pitch = notes[5];
		if(freq >= freqs[6] && freq < freqs[7]) pitch = notes[6];
		if(freq >= freqs[7] && freq < freqs[8]) pitch = notes[7];
		if(freq >= freqs[8] && freq < freqs[9]) pitch = notes[8];
		if(freq >= freqs[9] && freq < freqs[10]) pitch = notes[9];
		if(freq >= freqs[10] && freq < freqs[11]) pitch = notes[10];
		if(freq >= freqs[11] && freq < (freqs[1]*2)) pitch = notes[11];
	}
}