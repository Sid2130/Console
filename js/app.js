 $(document).ready(function(){
    $("#jsCode").focus();
    $("#jsCode").autogrow();
   
    app.createListFromLocal();
    var autocompleteSource = app.jsTags.concat(app.codesExecuted);
    $( "#jsCode" ).autocomplete({
      source: autocompleteSource
    });
});

$("#jsCode").bind('keypress', function(event) {
    if( event.shiftKey && event.which === 13 ) {
        return;
    }
    if(event.which === 13){
        event.preventDefault();
        app.processCode();
        return;
    }
});

console.log = function(message){
    app.printMessage(message)
}


var app = {

    jsTags : [
        'addEventListener', 'alert applicationCache', 'blur', 'break',
        'case', 'confirm', 'console', 'continue', 'copy', 'default', 'document', 'delete',
        'else', 'encodeURI', 'eval', 'finally', 'find', 'focus', 'for', 'function',
        'getEventListeners', 'getSelection', 'hasOwnProperty', 'history', 'if', 'in', 'isNaN', 'isPrototypeOf',
        'keys', 'length', 'localStorage', 'new','Object', 'onblur', 'onclick', 'ondblclick', 'prompt', 'return', 'sessionStorage', 'stop', 
        'this', 'throw', 'toString', 'typeof', 'try', 'valueOf', 'values', 'var', 'void', 'while', 'window', 'with' 
    ],
    codesExecuted : [],

    closeMenu: function(){
        $('#history-menu').removeClass('open');
        $('.console-box').removeClass('zoom-class');
        $('.menu-overlay').fadeOut();
    },

    openMenu: function(){
        $('#history-menu').addClass('open');
        $('.console-box').addClass('zoom-class');
        $('.menu-overlay').fadeIn();
    },

    addCodeToConsole: function(htmlObject){
        $("#jsCode").val($(htmlObject).text().trim());
        this.closeMenu();
    },

    processCode: function(){
        var executedCodesObject = {};
        var codeEntered = $("#jsCode").val();
        if(codeEntered === ""){
            return;
        }

        var response = this.executeScript(codeEntered);
        this.printMessage(codeEntered, 'code');
        
        $("#jsCode").val('').css('height','10vH');
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

        this.codesExecuted.push(executedCodesObject);
        localStorage.setItem("executedCodes", JSON.stringify(this.codesExecuted));
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



    clearOutputScreen: function(){
        $('.output-box').children().fadeOut(function(){
            $(this).remove();
        });
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
    },

    addInHistoryMenu: function(codeEntered, status){
        if(status === 'error'){
            $('#history-menu').append('<div class="menu-elements error" onclick="app.addCodeToConsole(this);"><i class="fa fa-exclamation-triangle pull-left"></i><span class="text">'+codeEntered+'</span></div>');
        }
        else{
            $('#history-menu').append('<div class="menu-elements success" onclick="app.addCodeToConsole(this);"><i class="fa fa-check-square pull-left"></i><span class="text">'+codeEntered+'</span></div>');
        }
        
    },


    createListFromLocal: function(){
        var storedObject = localStorage.getItem("executedCodes");
        if(storedObject === '' || storedObject === null){
            return;
        }
        storedObject = JSON.parse(storedObject);
        this.codesExecuted = storedObject;
        for(var index=0; index<storedObject.length; index++){
            this.addInHistoryMenu(storedObject[index].code, storedObject[index].status);
        }
    }
};






    

    
    

    


    
    