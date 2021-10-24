//������������� ������
function onYouTubeIframeAPIReady() {
	  player = new YT.Player('player', {
		height: '500',
		playerVars: { 'autoplay': 0, 'controls': 0, 'showinfo': 0, 'rel': 0},
		width: '850',
		videoId: 'CyVuYAHiZb8',
		events: {
		  'onReady': onPlayerReady
		}
  });
}

// ���������� ����������
function onPlayerReady(event) {
	var player = event.target;
	iframe = document.getElementById('player');
	setupListener(); 			  
	updateTimerDisplay();
	updateProgressBar();
				
	time_update_interval = setInterval(function () {
		updateTimerDisplay();
		updateProgressBar();
	}, 1000);		  
}
/*������� �������*/
function setupListener (){
	document.getElementById('full').addEventListener('click', playFullscreen);
}
/*��������� ����������*/
function playFullscreen (){
	player.playVideo();//won't work on mobile
			  
	  var requestFullScreen = iframe.requestFullScreen || iframe.mozRequestFullScreen || iframe.webkitRequestFullScreen;
	  if (requestFullScreen) {
		requestFullScreen.bind(iframe)();
	  }
}
/*��������� ��������*/			
function loadPlaylistVideoIds(); {
	player.loadPlaylist({
		'playlist': ['9HPiBJBCOq8', 'Mp4D0oHEnjc', '8y1D8KGtHfQ', 'jEEF_50sBrI'],
		'listType': 'playlist',
		'index': 0,
		'startSeconds': 0,
		'suggestedQuality': 'small'
			});
}			
/*���������*/
function editVolume () {				
	if (player.getVolume() == 0) {
		player.setVolume('100');
	} else {
		player.setVolume('0');
	}
}
			
/*��������*/
function editQuality () {
	player.setPlaybackQuality('medium');			
	document.getElementById('quality').innerHTML = '480';
}
			
// ��������� ����� �� �������� - �������
function updateTimerDisplay(){
	document.getElementById('time').innerHTML = formatTime(player.getCurrentTime());
}
/*������ �������*/
function formatTime(time){
	time = Math.round(time);
	var minutes = Math.floor(time / 60),
	seconds = time - minutes * 60;
	seconds = seconds < 10 ? '0' + seconds : seconds;
	return minutes + ":" + seconds;
}

// ��������� ��������
function updateProgressBar(){

	var line_width = jQuery('#line').width();
	var persent = (player.getCurrentTime() / player.getDuration());
	jQuery('.viewed').css('width', persent * line_width);
	per = persent * 100;
	jQuery('#fader').css('left', per+'%');
}

/*����� ���������*/
function progress (event) {
				
	var line_width = jQuery('#line').width();
	// ��������� ��������
	var pos = jQuery('#line').offset();
	var elem_left = pos.left;		
	// ��������� ������� ������ ��������
	var Xinner = event.pageX - elem_left;
	var newTime = player.getDuration() * (Xinner / line_width);
	// Skip video to new time.
	player.seekTo(newTime);
}