$( document ).ready(function() {
    
    
    //var socket = io()
    var line = ''
    $('input[name=command]').focus()
    
    $(this).keypress(function(e) {
        if(e.which == 13) {
            if($('input[name=command]').last().val() == 'login'){
                
                $('#login_form').attr('action', '/login')
                
                if(!$('input[name=username]').length){
                    line = '<font style=\'font-weight:bold;color:#00FF00; \'>username: </font>'
                    line += '<input type=\'text\' name=\'username\' class=\'terminal_input\' autocomplete=\'off\' /><br/>'
                    $('.terminal').append(line).each(function(){
                        $("input[name=command]").attr('readonly', true)
                        $('input[name=username]').focus()
                    })                
                }else{
                    
                    if(!$('input[name=password]').length){
                        line = '<font style=\'font-weight:bold;color:#00FF00; \'>password: </font>'
                        line += '<input type=\'password\' name=\'password\' class=\'terminal_input\' /><br/>'
                        $('.terminal').append(line).each(function(){
                            $("input[name=username]").attr('readonly', true)
                            $('input[name=password]').focus()
                        })                
                    }else{                        
                        $( "#login_form" ).appendTo(document.body).submit()                       
                    }                    
                }
                
            }else if($('input[name=command]').last().val() == 'register'){
                
                $('#login_form').attr('action', '/register')
                
                if(!$('input[name=code]').length){
                    line = '<font style=\'font-weight:bold;color:#00FF00; \'>code: </font>'
                    line += '<input type=\'text\' name=\'code\' class=\'terminal_input\' autocomplete=\'off\' /><br/>'
                    $('.terminal').append(line).each(function(){
                        $("input[name=command]").attr('readonly', true)
                        $('input[name=code]').focus()
                    })                
                }else{
                    
                    if(!$('input[name=username]').length){
                        line = '<font style=\'font-weight:bold;color:#00FF00; \'>username: </font>'
                        line += '<input type=\'text\' name=\'username\' class=\'terminal_input\' autocomplete=\'off\' /><br/>'
                        $('.terminal').append(line).each(function(){
                            $("input[name=command]").attr('readonly', true)
                            $('input[name=username]').focus()
                        })                
                    }else{

                        if(!$('input[name=password]').length){
                            line = '<font style=\'font-weight:bold;color:#00FF00; \'>password: </font>'
                            line += '<input type=\'password\' name=\'password\' class=\'terminal_input\' /><br/>'
                            $('.terminal').append(line).each(function(){
                                $("input[name=username]").attr('readonly', true)
                                $('input[name=password]').focus()
                            })                
                        }else{

                            if(!$('input[name=password2]').length){
                                line = '<font style=\'font-weight:bold;color:#00FF00; \'>repeat password: </font>'
                                line += '<input type=\'password\' name=\'password2\' class=\'terminal_input\' /><br/>'
                                $('.terminal').append(line).each(function(){
                                    $("input[name=password]").attr('readonly', true)
                                    $('input[name=password2]').focus()
                                })                
                            }else{   
                                if($('input[name=password]').val() == $('input[name=password2]').val()){
                                    $( "#login_form" ).appendTo(document.body).submit()     
                                }             
                            }                    
                        }                   
                    }                
                }                                                
            }else{
                e.preventDefault();
                line = ''
                $("input[name=command]").attr('readonly', true);
                if($("input[name=command]").last().val() !== ''){
                    line += '<font style=\'font-weight:bold;\'>Command not found</font><br/>'
                }
                line += '<font style=\'font-weight:bold;color:#00FF00;\'>alexandria:</font><font style=\'font-weight:bold;color:#3287f0\'> ~ ฿ </font>'
                line += '<input type=\'text\' name=\'command\' class=\'terminal_input\' autocomplete=\'off\'/><br/>'

                $('.terminal').append(line).each(function(){
                    $("input[name=command]").last().attr('readonly', false)
                    $("input[name=command]").last().focus()
                })                
                return false;
            }
        }
    })

})