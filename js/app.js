 $(document).ready(function(){
    $("#jsCode").focus();
    $("#jsCode").autogrow();
   
    app.getCodesExecutedList();
    app.createListFromLocal();

    var autocompleteSource = app.jsTags.concat(app.codesExectedList);
    //console.log(JSON.stringify(autocompleteSource));
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
    
    codesExecutedObjectsArray: [],
    codesExectedList: [],


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
            app.codesExectedList.push(storedObject[index].code);
        }
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
        return inputText.substr(0, $("#jsCode").selectionStart).split("\n").length;
    },

    lastLineOfInput: function(){
        var inputText = $("#jsCode").val();
        return inputText.lastIndexOf("\n")+1;
    },


    openMenu: function(){
        $('#history-menu').addClass('open');
        $('.console-box').addClass('zoom-class');
        $('.menu-overlay').fadeIn();
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

        this.codesExecutedObjectsArray.push(executedCodesObject);
        localStorage.setItem("executedCodes", JSON.stringify(this.codesExecutedObjectsArray));
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






    

    
    

    


    
    