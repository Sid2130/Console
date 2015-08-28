<!DOCTYPE html>
<html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href='http://fonts.googleapis.com/css?family=Open+Sans:400,300,600,700' rel='stylesheet' type='text/css'>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css">
        <link rel="stylesheet" href="http://code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css">
        <link rel="stylesheet" href="css/style.css">
    </head>
    <body>

        <div class="main-container">
            <div class="menu-container">
                <div class="functional-buttons clear-input" title="Clear Console Input">
                    <i class="fa fa-eraser" onclick="app.clearInputScreen();"></i>
                </div>
                <div class="functional-buttons clear-console" title="Clear Console Output">
                    <i class="fa fa-ban" onclick="app.clearOutputScreen();"></i>
                </div>
                <div class="functional-buttons info" title="About Console">
                    <i class="fa fa-info-circle"></i>
                </div>
                <div class="functional-buttons history-menu-button" onclick="app.openMenu();" title="History of Codes Executed">
                    <i class="fa fa-history"></i>
                </div>
            </div>

            <div class="console-box">
                <div class="input-box">
                    <div class="textarea-container">
                        <div class="console-icon pull-left">
                              <i class="fa fa-angle-right"></i>
                        </div>
                        <textarea id="jsCode" class="pull-left" autofocus></textarea>
                    </div>
                </div>
                <div class="output-box"></div>
            </div>
        </div>

        <div class="menu-overlay"></div>
        <div id="history-menu" class="history-menu">
            <div class="menu-button menu-close"><i class="fa fa-times" onclick="app.closeMenu();" title="Close history list"></i></div>
            <div class="menu-button clear-history"><i class="fa fa-trash" onclick="app.clearHistory();" title="Clears codes history"></i></div>
            <div class="menu-entries-container"></div>
        </div>
        
        <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
        <script src="http://code.jquery.com/ui/1.11.4/jquery-ui.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>
        <script src="libs/autogrow.min.js"></script>
        <script src="libs/underscore.js"></script>
        <script src="js/app.js"></script>
    
    </body>
</html>




<!-- <textarea onkeyup="getLineNumber(this, document.getElementById('lineNo'));" onmouseup="this.onkeyup();"></textarea>
<div id="lineNo"></div>

<script>

    function getLineNumber(textarea, indicator) {

        indicator.innerHTML = textarea.value.substr(0, textarea.selectionStart).split("\n").length;
    }

</script> -->