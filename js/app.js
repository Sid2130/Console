var currentPointer = '';
var executedPointer = '';


$(document).ready(function(){
    $("#jsCode").focus();
    $("#jsCode").autogrow();
   
    app.getCodesExecutedList();
    app.createListFromLocal();
    app.initializeAutoComplete();

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
        return;
    }
    if(event.which === 40){
        //down key
        var lineNumber = app.getLineNumber();
        var lastLineNumber = app.lastLineOfInput();
        if(lineNumber === lastLineNumber){
            app.nextExecutedCode();
        }
        
        return;
    }
});


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
        if(codeEntered.indexOf('<') > -1){
            codeEntered = codeEntered.replace(/</g, '&lt;');
        }
        if(status === 'error'){
            $('#history-menu .menu-entries-container').append('<div class="menu-elements error" onclick="app.addCodeToConsole(this);"><i class="fa fa-exclamation-triangle pull-left"></i><span class="text">'+codeEntered+'</span></div>');
        }
        else{
            $('#history-menu .menu-entries-container').append('<div class="menu-elements success" onclick="app.addCodeToConsole(this);"><i class="fa fa-check-square pull-left"></i><span class="text">'+codeEntered+'</span></div>');
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

    clearInputScreen: function(){
        $("#jsCode").val('');
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
            //response = window[codeReceived];
            console.log(response);
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

        this.initializeIndex();
    },

    initializeAutoComplete: function(){
        var autocompleteSource = this.jsTags.concat(_.uniq(this.codesExecutedList));
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
    },

    initializeIndex: function(){
        if(app.codesExecutedList.length === 0){
            return;
        }
        if(app.codesExecutedList.length === 1){
            executedPointer = 0;
            currentPointer = 0;
        }
        if(app.codesExecutedList.length > 1){
            executedPointer = app.codesExecutedList.length - 1;
            currentPointer = executedPointer - 1;
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
        return inputText.substr(0, $("#jsCode")[0].selectionStart).split("\n").length;
    },

    lastLineOfInput: function(){
        var inputText = $("#jsCode").val();
        if(inputText.indexOf("\n") < 0){
            return 1;
        }
        return (inputText.length - inputText.replace(/\n/g,'').length)+1;
    },

    nextExecutedCode: function(){
        if( currentPointer === app.codesExecutedList.length+1 && executedPointer === app.codesExecutedList.length)
            return;

        if(currentPointer === app.codesExecutedList.length-2 && executedPointer === app.codesExecutedList.length - 1)
            return;
        
        if(currentPointer === -2 && executedPointer === -1 ){
            executedPointer = 1;
            currentPointer = 2;
        }

        if(executedPointer > currentPointer){
            executedPointer = executedPointer + 2;
            currentPointer = executedPointer + 1;
        }
        
        this.executeCodeAtThisIndex(executedPointer);

        if(executedPointer < currentPointer){
            executedPointer = currentPointer;
            currentPointer = currentPointer + 1;
        }    
        
    },

    openMenu: function(){
        $('#history-menu').addClass('open');
        $('.console-box').addClass('zoom-class');
        $('.menu-overlay').fadeIn();
    },


    previousExecutedCode: function(){  
        var limitFlag = false;
        if( currentPointer === -2 && executedPointer === -1){
            return;
        }

        if( currentPointer === app.codesExecutedList.length+1 && executedPointer === app.codesExecutedList.length){
            currentPointer = app.codesExecutedList.length -2;
            executedPointer = app.codesExecutedList.length -1;
            limitFlag = true;
        }

        if(executedPointer < currentPointer && limitFlag == false){
            executedPointer = executedPointer - 2;
            currentPointer = executedPointer - 1;
        }
 
        this.executeCodeAtThisIndex(executedPointer);

        if(executedPointer > currentPointer){
            executedPointer = currentPointer;
            currentPointer = currentPointer - 1;
        }  
    },


    executeCodeAtThisIndex: function(indexValue){
        var codeExecuted = app.codesExecutedList[indexValue];
        $("#jsCode").val(codeExecuted);
    },

    processCode: function(){
        var executedCodesObject = {};
        var codeEntered = $("#jsCode").val();
        if(codeEntered === ""){
            return;
        }

        var codeEnteredToPrint = codeEntered.replace(/</g, '&lt;');

        this.printMessage(codeEnteredToPrint, 'code');
        var response = this.executeScript(codeEntered);
        
        $("#jsCode").val('').css('height','5vH');
        if(response.status === 'error'){
            this.printMessage(response.message, 'error');
            //this.addInHistoryMenu(codeEntered, 'error');
        }
        
        else{
            this.printMessage(response.message, 'ok');
            //this.addInHistoryMenu(codeEntered, 'ok');
        }

        executedCodesObject.status = response.status;
        executedCodesObject.code = codeEntered;
        this.codesExecutedList.push(executedCodesObject.code);
        this.reFactorExecutedCodesArray();

        var indexForMenuUpdate = this.reFactorExecutedCodesObjectArray(executedCodesObject);
        this.updateHistoryMenu(indexForMenuUpdate, executedCodesObject);
        
        this.initializeIndex();
        this.initializeAutoComplete();
    },

    reFactorExecutedCodesArray: function(){
        this.codesExecutedList = _.uniq(this.codesExecutedList);
    },


    updateHistoryMenu: function(index, executedCodesObject){
        console.log(index);
        if(index > -1){
            var childIndex = index + 1;
            var htmlToAppend = $('.menu-entries-container .menu-elements:nth-child('+childIndex+')').clone();
            $('.menu-entries-container .menu-elements:nth-child('+childIndex+')').remove();
            $('.menu-entries-container').append(htmlToAppend);
        }
        else{
            if(executedCodesObject.status === 'error'){
                this.addInHistoryMenu(executedCodesObject.code, 'error');
            }
            else{
                this.addInHistoryMenu(executedCodesObject.code, 'ok');
            }
        }
        
    },

    reFactorExecutedCodesObjectArray: function(lastObjectToPush){
        var lastExecutedCode = lastObjectToPush.code;
        var currentArray = this.codesExecutedObjectsArray;
        var lastIndexOfExecutedCode = _.findLastIndex(currentArray, { code: lastExecutedCode });
        if(lastIndexOfExecutedCode > -1){
            for(var index = lastIndexOfExecutedCode; index < currentArray.length; index++){
                currentArray[index] = currentArray[index+1];
                if(index === currentArray.length - 1){
                    currentArray[index] = lastObjectToPush;
                }
            }
            this.codesExecutedObjectsArray = currentArray;
        }
        else{
            this.codesExecutedObjectsArray.push(lastObjectToPush);
        } 
        localStorage.setItem("executedCodes", JSON.stringify(this.codesExecutedObjectsArray));
        return lastIndexOfExecutedCode;
    },




    replaceGreaterThan: function(receivedString){
        if(typeof(receivedString) == 'object'){
            receivedString = JSON.stringify(receivedString);
        }

        if(receivedString.constructor === Array){
            receivedString = receivedString+'';
        }

        if(receivedString !== undefined && receivedString !== null && receivedString !== ''){
            receivedString = receivedString.replace(/</g, '&lt;');

        }
        return receivedString;
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


    