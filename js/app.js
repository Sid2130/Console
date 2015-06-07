var appHistoryIndex;

$(document).ready(function(){
    $("#jsCode").focus();
    $("#jsCode").autogrow();
   
    app.getCodesExecutedList();
    app.createListFromLocal();

    var autocompleteSource = app.jsTags.concat(app.codesExecutedList);
    //console.log(JSON.stringify(autocompleteSource));
    $( "#jsCode" ).autocomplete({
        source: autocompleteSource,
        response: function(event, ui) {
            // ui.content is the array that's about to be sent to the response callback.
            if (ui.content.length === 0) {
                $("#empty-message").text("No results found");
            } else {
                $("#empty-message").empty();
            }
        }
    });
});


$("#jsCode").bind('keydown', function(event) {
    if( event.shiftKey && event.which === 13 ) {
        return;
    }
    if(event.which === 13){
        event.preventDefault();
        app.processCode();
        return;
    }
    
});


$("#jsCode").bind('keyup', function(event) {
    
    if(event.which === 38){
        //up key
        var lineNumber = app.getLineNumber();
        if(lineNumber === 1){
            app.previousExecutedCode();
        }
        console.log(appHistoryIndex);
        return;
    }
    if(event.which === 40){
        //down key
        var lineNumber = app.getLineNumber();
        var lastLineNumber = app.lastLineOfInput();
        if(lineNumber === lastLineNumber){
            app.nextExecutedCode();
        }
        console.log(appHistoryIndex);
        return;
    }
});

console.log = function(message){
    app.printMessage(message);
}


 

var app = {

    jsTags : [
        'addEventListener', 'alert', 'app', 'applicationCache', 'blur', 'break',
        'case', 'confirm', 'console', 'continue', 'copy', 'default', 'document', 'delete',
        'else', 'encodeURI', 'eval', 'finally', 'find', 'focus', 'for', 'function',
        'getEventListeners', 'getSelection', 'hasOwnProperty', 'history', 'if', 'in', 'isNaN', 'isPrototypeOf',
        'keys', 'length', 'localStorage', 'new','Object', 'onblur', 'onclick', 'ondblclick', 'prompt', 'return', 'sessionStorage', 'stop', 
        'this', 'throw', 'toString', 'typeof', 'try', 'valueOf', 'values', 'var', 'void', 'while', 'window', 'with' 
    ],
    
    codesExecutedObjectsArray: [],
    codesExecutedList: [],


    addCodeToConsole: function(htmlObject){
        $("#jsCode").val($(htmlObject).text().trim());
        this.closeMenu();
    },


    addInHistoryMenu: function(codeEntered, status){
        if(status === 'error'){
            $('#history-menu').append('<div class="menu-elements error" onclick="app.addCodeToConsole(this);"><i class="fa fa-exclamation-triangle pull-left"></i><span class="text">'+codeEntered+'</span></div>');
        }
        else{
            $('#history-menu').append('<div class="menu-elements success" onclick="app.addCodeToConsole(this);"><i class="fa fa-check-square pull-left"></i><span class="text">'+codeEntered+'</span></div>');
        }  
    },


    clearHistory: function(){
        var clearHistoryConfirm = confirm("Are you sure you want to clear history?")
        if(clearHistoryConfirm){
            localStorage.setItem("executedCodes","");
            $('#history-menu .menu-elements').fadeOut(function(){
                $(this).remove();
            });
            this.closeMenu();
        }
        else{
            return;
        }
        
    },

    clearOutputScreen: function(){
        $('.output-box').children().fadeOut(function(){
            $(this).remove();
        });
    },


    createListFromLocal: function(){
        var storedObject = this.getCodesExecutedObject();
        if(storedObject === '' || storedObject === null){
            return;
        }
        this.codesExecutedObjectsArray = storedObject;
        for(var index=0; index<storedObject.length; index++){
            this.addInHistoryMenu(storedObject[index].code, storedObject[index].status);
        }
    },

    closeMenu: function(){
        $('#history-menu').removeClass('open');
        $('.console-box').removeClass('zoom-class');
        $('.menu-overlay').fadeOut();
    },


    executeScript: function(codeReceived){
        var response;
        try{
            response = window.eval(codeReceived);
        }
        catch(error){
            return {status: 'error', message: error};
        }
        return {status: 'ok', message: response};
    },



    
    getCodesExecutedList: function(){
        var storedObject = this.getCodesExecutedObject();
        for(var index=0; index<storedObject.length; index++){
            app.codesExecutedList.push(storedObject[index].code);
        }

        appHistoryIndex = app.codesExecutedList.length - 1;
    },


    getCodesExecutedObject: function(){
        var storedObject = localStorage.getItem("executedCodes");
        if(storedObject === '' || storedObject === null){
            return '';
        }
        storedObject = JSON.parse(storedObject);
        return storedObject;
    },

    getLineNumber: function(){
        var inputText = $("#jsCode").val();
        return inputText.substr(0, $("#jsCode")[0].selectionStart).split("\n").length;
    },

    lastLineOfInput: function(){
        var inputText = $("#jsCode").val();
        if(inputText.indexOf("\n") < 0){
            return 1;
        }
        return (inputText.length - inputText.replace(/\n/g,'').length)+1; //lastIndexOf("\n")+1;
    },

    nextExecutedCode: function(){
        var codeExecuted = app.codesExecutedList[appHistoryIndex];
        $("#jsCode").val(codeExecuted);
        if((appHistoryIndex+1) <= app.codesExecutedList.length){
            appHistoryIndex++;
        }
    },

    openMenu: function(){
        $('#history-menu').addClass('open');
        $('.console-box').addClass('zoom-class');
        $('.menu-overlay').fadeIn();
    },

    previousExecutedCode: function(){
        var codeExecuted = app.codesExecutedList[appHistoryIndex];
        $("#jsCode").val(codeExecuted);

        if((appHistoryIndex-1) >= 0){
            appHistoryIndex--;
        }
    },

    processCode: function(){
        var executedCodesObject = {};
        var codeEntered = $("#jsCode").val();
        if(codeEntered === ""){
            return;
        }
        this.printMessage(codeEntered, 'code');
        var response = this.executeScript(codeEntered);
        
        
        $("#jsCode").val('').css('height','5vH');
        if(response.status === 'error'){
            this.printMessage(response.message, 'error');
            this.addInHistoryMenu(codeEntered, 'error');
        }
        
        else{
            this.printMessage(response.message, 'ok');
            this.addInHistoryMenu(codeEntered, 'ok');
        }

        executedCodesObject.status = response.status;
        executedCodesObject.code = codeEntered;
        this.codesExecutedList.push(executedCodesObject.code);
        this.codesExecutedObjectsArray.push(executedCodesObject);
        localStorage.setItem("executedCodes", JSON.stringify(this.codesExecutedObjectsArray));
        appHistoryIndex++;
    },


   


    printMessage: function(message, status){
        if(status === 'error'){
            $('.output-box').append('<div class="console-response color-red">'+message+'</div>');
        }
        else if(status === 'ok'){
            $('.output-box').append('<div class="console-response color-green">'+message+'</div>');
        }
        else if(status === 'code'){
            $('.output-box').append('<div class="code-entered">'+message+'</div>');
        }
        else{
            $('.output-box').append('<div class="console-response color-blue">'+message+'</div>');
        }
    }
   
    


    
};






    

    
    

    


    
    