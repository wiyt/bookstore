$(function(){
    $.getJSON("./publish.json",function(data){
        var publish = data.publish;
        $("#publish").append('<option value=""></option>');
        for(var i = 0; i < publish.length; i++){
            $("#publish").append(['<option value="',publish[i],'">',publish[i],'</option>'].join(""));
        }
    });
});