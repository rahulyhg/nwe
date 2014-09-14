<script type="text/javascript">  
    var ajaxProcess = false;
    
    function IsEmail(email) {
        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return regex.test(email);
    }
    
    function sendPassword(formid) {
        
        var validEmail = IsEmail($('#forgot_password_form #forgot_password_email').val());
        //console.log(validEmail);
        //if (!validEmail)
            //return false;
            
        if (ajaxProcess)
            return false;
        ajaxProcess = true;
        $.ajaxSetup({
            beforeSend: function(xhr, options){
                if(!validEmail){
                    xhr.abort();
                    $("#forgot_password_invalid").fadeIn('slow').delay(5000).fadeOut();
                }
            },
            complete: function() {
                //$("#forgot_password_master").show();
            }
        });
        $.ajax({
            dataType: "html", type: "POST", evalScripts: true,
            url: "<?php echo NETWORKWE_URL ?>/users/forgot_password/",
            data: $("#" + formid).serialize(),
            success: function(data) {
                ajaxProcess = false;
                if (data == 1) {
                    $("#forgot_password_thankyou h3").append($("#forgot_password_email").val());
                    $("#forgot_password_master").hide();
                    $("#forgot_password_error").hide();
                    $("#forgot_password_thankyou").fadeIn('slow').delay(5000).fadeOut();
                    $("#forgot_password_master").delay(6000).fadeIn('slow');
                } else if (data == 0) {
                    $("#forgot_password_master").hide();
                    $("#forgot_password_thankyou").hide();
                    $("#forgot_password_error").fadeIn('slow').delay(5000).fadeOut();
                    $("#forgot_password_master").delay(6000).fadeIn('slow');
                    //alert("The email address you entered is not registered with NetworkWe Account.")
                } else {
                    alert("Error occured. Please try again.")
                }
            }
        });
    }
</script>
<?php echo $this->Form->create("User", array('controller' => 'users', 'method' => 'post', 'action' => 'login', 'class' => 'login_form')); ?>
<table width="100%" border="0" cellspacing="2" cellpadding="1">
    <tr>
        <td colspan="2">
            <?php echo $this->Form->input('email', array('required' => true, 'type' => 'email', 'label' => false, 'div' => false, 'placeholder' => 'User ID', 'class' => 'textfield width1 signin-text', 'size' => '26'));
            ?>
        </td>
    </tr>
    <tr>
        <td colspan="2">
            <?php echo $this->Form->input('password', array('required' => true, 'type' => 'password', 'label' => false, 'div' => false, 'placeholder' => 'Password', 'class' => 'textfield width1 signin-text', 'size' => '26')); ?>
        </td>
    </tr>
    <tr>
        <td width="36%">
            <?php echo $this->Form->submit('Sign In', array('type' => 'submit', 'label' => false, 'class' => 'red-bttn')); ?>
        </td>
        <td width="64%" align="right">
            <?php echo $this->Html->link('Forgot Password?', '#?', array('rel' => 'forgot_password', 'class' => 'poplight', 'escapeTitle' => false, 'title' => '')); ?>
        </td>
    </tr>
</table>
<?php echo $this->Form->end(); ?>

<!--- Login Box Starts Here --->
<div id="forgot_password" class="popup_block" style="width:500px;">
    <div class="popup-heading"><h1>Forgot Password</h1></div>
    <div id="forgot_password_master">
        <form action="" id="forgot_password_form" method="get" class="loginformstyle" onsubmit="return false;">
            <fieldset>
                <label style="width:500px;" for="">Please enter your email to reset your password</label>
                <label1 style="width:500px;">
                    <input name="forgot_password_email" type="text" class="textfield width1 signin-text" id="forgot_password_email" placeholder="email address"/> 
                    <input type="submit" onclick="return sendPassword('forgot_password_form');" value="Submit" />
                </label1>
            </fieldset>
        </form>
    </div>
    <div id="forgot_password_error" style="display:none;">
        <h3>The email address you entered is not registered with NetworkWe Account.</h3>
    </div>
    <div id="forgot_password_thankyou" style="display:none;">
        <h3>A password reset email has been sent to </h3>
    </div>
    <div id="forgot_password_invalid" style="display:none;">
        <h3>Not a valid email.</h3>
    </div>
</div>
<!--- Login Box Ends Here --->