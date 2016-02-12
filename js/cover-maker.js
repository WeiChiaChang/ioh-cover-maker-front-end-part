/**
 *	@editor arfullight
 *	@date   2016/2/8
 *  @info   refactory
 */


$(function(){

	//----var definition----

	var selfieImageData, 
			posterImageData,
			fileName = "cover.jpg",
			errorArray = [];

	/**
	 *  @info start cropit
	 */
	$('.image-editor:eq(0)').cropit({
    imageBackground: true,
    imageBackgroundBorderWidth: 50,
  });

  $('.image-editor:eq(1)').cropit({
  	exportZoom: 2,
    imageBackground: true,
    imageBackgroundBorderWidth: 50,
  });

	//fix image preview
  $('.cropit-image-background-container:eq(1)').css('left', '144px');

  $('.cropit-image-background-container:eq(0)').css('left', '74px');


  /** 
   *  @info  get picture data after cut 
   *  
   *  @param selfieImageData, posterImageData
   */
  $('.selfie-export').click(function() {
    selfieImageData = $('.image-editor').cropit('export', {
		  type: 'image/jpeg',
		  quality: .9,
		  originalSize: true
		});

    $('#selfie-image').attr("src", selfieImageData);
    
    $('#selfie-modal').modal('hide');

  });
  
  $('.poster-export').click(function() {
    posterImageData = $('#poster-image-editor').cropit('export', {
		  type: 'image/jpeg',
		  quality: .9,
		  originalSize: true
		});

    $('#poster-image').attr("src", posterImageData);
    
    $('#poster-modal').modal('hide');

  });

  //----cropit btn animation----

  $('#selfie-detector').mouseenter(function(){
    
      $('#selfie-button-word').animate({
          opacity: 1
      }, 200 );
      $('#selfie-button-area').animate({
          opacity: 1
      }, 200 );
    
  });
   

  $('#selfie-detector').mouseleave(function(){
    
      $('#selfie-button-area').animate({
        opacity: 0
      }, 50 );
      $('#selfie-button-word').animate({
          opacity: 0
      }, 200 );
    
  });

  $('#poster-button-detector').mouseenter(function(){
    
      $('#poster-button-word').animate({
          opacity: 1
      }, 200 );
      $('#poster-button-area').animate({
          opacity: 1
      }, 200 );
    
  });

  $('#poster-button-detector').mouseleave(function(){
    
      $('#poster-button-area').animate({
        opacity: 0
      }, 50 );
      $('#poster-button-word').animate({
          opacity: 0
      }, 200 );
    
  });

  //----edit area----

  //selfie
  $('#selfie-toggle').change(function() {
    if($(this).prop('checked') == false) 
      $('#selfie-all').hide();
    else 
      $('#selfie-all').show();

    //disable download btn
    if (!readyForExport()){
    	$('#download').attr('disabled', true);
    	$('#download').removeAttr('href');
    	$('#download').removeAttr('download');
    }
  });

  //location color
  $('#location-toggle').change(function() {
    if($(this).prop('checked') == false) {
      $('#location-textarea').css("color", "black");
    }
    else {
      $('#location-textarea').css("color", "white");
    }
  });

  //experience color (all three)
	$('#experience-toggle-1').change(function() {
    if($(this).prop('checked') == true) { 
      $('#experience-1').css("color", "red");
    }
    else {
      $('#experience-1').css("color", "black");
    }
  });

  $('#experience-toggle-2').change(function() {
    if($(this).prop('checked') == true) { 
      $('#experience-2').css("color", "red");
    }
    else {
      $('#experience-2').css("color", "black");
    }
  });

  $('#experience-toggle-3').change(function() {
    if($(this).prop('checked') == true) { 
      $('#experience-3').css("color", "red");
    }
    else {
      $('#experience-3').css("color", "black");
    }
  });
  

  //----canvas area----

  var canvasFinish;

  /**
   *  draw ioh cover using canvas
   *
   *  @use selfieImageData, posterImageData
	 *
   *  @use canvasFinish
   */
  function doCanvas()
  {
  	//create canvas and basic settings
  	var canvas = document.createElement('canvas'),
				ctx    = canvas.getContext('2d');
		
		canvas.width  = 1920;
		canvas.height = 1080;

		//----load images----
		var numberOfImg = 2,
				imgLoaded   = 0;

		function readyToDraw()
		{
			if(numberOfImg == imgLoaded)
				return true;
			else
				return false;
		}

		function drawCanvas()
		{
			ctx.drawImage(posterBGI, 0, 0, 1920, 860);

			if ($('#selfie-toggle').prop('checked'))
				ctx.drawImage(posterSelfie, 1540, 466, 320, 320);

			ctx.drawImage(posterIOH, 0, 860);

			drawTextArea();
		  drawLocationText();
		  drawNameAndExperienceText();

		  canvasFinish = canvas;
		}

		//畫文字框
    function drawTextArea()
    {
      var text = document.getElementById('poster-content-textarea').value;
      var lines = text.split("\n");
      var height = lines.length * 34 + 30;
      
      //文字框背景
      ctx.globalAlpha = 0.56;
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(870, 796-height, 620, height);  
      
      //文字本身
      ctx.globalAlpha = 1;
      ctx.font="700 30px Helvetica";
      ctx.fillStyle = "#000000";
      
      var y = 836-height;
      
      for(var i = 0; i < lines.length; i++) {
        var words = lines[i].split(' ');
        var line = '';
        
        for (var n = 0; n < words.length; n++) {
          var testLine = line + words[n] + ' ';
          line = testLine;
        }
    
        ctx.fillText(line, 890, y);
        y += 34;
      }
    }
      
    //畫地點文字
    function drawLocationText()
    {
      var text = document.getElementById('location-textarea').value;

      //文字本身
      ctx.globalAlpha = 1;
      ctx.font="700 24px Helvetica";
      if($('#location-toggle').prop('checked') == true) { // 白字
        ctx.fillStyle = "#FFFFFF";
      }
      else {
        ctx.fillStyle = "#000000";
      }
      ctx.textAlign = "right";
      ctx.fillText(text, 1870, 840);
    }
      
    //畫名字和經歷
    function drawNameAndExperienceText() 
    {
      var name = document.getElementById('name-textarea').value;
      var exp1 = document.getElementById('experience-1').value;
      var exp2 = document.getElementById('experience-2').value;
      var exp3 = document.getElementById('experience-3').value;
        
      ctx.font = "700 28px Helvetica";
      ctx.fillStyle = "#000000";
      ctx.fillText(name, 1870, 910);

      if($('#experience-toggle-1').prop('checked') == true) {
        ctx.fillStyle = "#FF0000";
      }
      else {
        ctx.fillStyle = "#000000";
      }
      ctx.fillText(exp1, 1870, 955);
      if($('#experience-toggle-2').prop('checked') == true) {
        ctx.fillStyle = "#FF0000";
      }
      else {
        ctx.fillStyle = "#000000";
      }
      ctx.fillText(exp2, 1870, 1000);
      if($('#experience-toggle-3').prop('checked') == true) {
        ctx.fillStyle = "#FF0000";
      }
      else {
        ctx.fillStyle = "#000000";
      }
      ctx.fillText(exp3, 1870, 1045);
    }

		//poster selfie
    if ($('#selfie-toggle').prop('checked') == true) {
      
      numOfImg = 3;
      var posterSelfie = new Image();
      
      posterSelfie.onload = function(){
        imgLoaded ++;

        if (readyToDraw())
        	drawCanvas();
    	};
    
      posterSelfie.src = selfieImageData;

    }


		//poster backgroung image
    var posterBGI = new Image();
    
    posterBGI.onload = function(){
    	imgLoaded ++;

      if (readyToDraw())
      	drawCanvas();
  	};
        
    posterBGI.src = posterImageData;
        

  	//poster IOH banner
    var posterIOH = new Image();
    
  	posterIOH.onload = function(){
    	imgLoaded ++;

      if (readyToDraw())
      	drawCanvas();
  	};
    
    posterIOH.src = "img/testIOH.png";

  }


  //----download btn----

  function readyForExport()
  {
  	errorArray = [];

  	if (document.getElementById('name-textarea').value == "")
  		errorArray.push("人名尚未填寫");
  	
  	if (document.getElementById('experience-1').value == "")
  		errorArray.push("經驗尚未填寫");

  	if (document.getElementById('location-textarea').value == "" || document.getElementById('location-textarea').value == "地點：")
  		errorArray.push("地點尚未填寫");

  	if (document.getElementById('poster-content-textarea').value == "")
  		errorArray.push("文字框尚未填寫");

  	if (typeof(selfieImageData) == 'undefined' && $('#selfie-toggle').prop('checked'))
  		errorArray.push("大頭貼尚未上傳");

  	if (typeof(posterImageData) == 'undefined')
  		errorArray.push("背景照尚未上傳");

  	if (errorArray.length == 0)
  		return true;
  	else
  		return false;
  }

  /**
   *  download the cover
   *
   *  @use fileName
   */
  $('#draw').click(function(){

  	//check if img is uploaded
  	if (readyForExport()) {

	  	doCanvas();

	  	var appendCanvas = function(){
	  		if (typeof(canvasFinish) != 'undefined'){

	  			var self = $('#download')[0];
	  			self.href = canvasFinish.toDataURL("image/jpeg");
	  			self.download = fileName;

	 				$('#download').attr('disabled', false);

	  			stopRepeat();
	  		}
	  		else
	  			console.log('waiting');
	  	};

	  	var id = setInterval(appendCanvas, 30);

	  	var stopRepeat = function(){
	  		clearInterval(id);
	  	};

  	}
  	else{
  		var htmlText = "<ul>";

  		for (var i = 0; i < errorArray.length; i ++){
  			htmlText += "<li>";
  			htmlText += errorArray[i];
  			htmlText += "</li>";
  		}

  		htmlText += "</ul>";
  		$('#error-message').html(htmlText);

  		$('.error-modal').modal();
  	}

  });

});