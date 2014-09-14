<?php 
$category_name = htmlspecialchars_decode($category['news_categories']['category'], ENT_NOQUOTES);
$this->Html->addCrumb(' Dashboard', '/admin');
$this->Html->addCrumb(' News', array('controller' => 'news', 'action' => 'index'));
$this->Html->addCrumb(' Categories', array('controller' => 'news', 'action' => 'categories'));
$this->Html->addCrumb(' ' . $category_name, array('controller' => 'news', 'action' => 'edita', $this->request->pass[0]));
echo $this->element('Siteadmin/breadcrumb'); ?>
<div class="row-fluid sortable">
    <div class="box span12">
        <div class="box-header well" data-original-title>
            <h2><i class="icon-edit"></i> Edit Category</h2>
        </div>
        <div class="box-content well-large">
            
            <div class="box-content"><br/>
                <form class="form-horizontal" action="#" method="post" id="form_admin" name="form">
                    <fieldset>
                        <div class="control-group">
                            <label class="control-label" for="category_name">Category</label>
                            <div class="controls">
                                <input class="input-xlarge focused" id="selectComapny" name="category_name" type="text" value="<?=$category_name?>">
                            </div>
                        </div>
                        <div class="control-group">
                            <div class="controls">
                                <button type="submit" class="btn btn-primary">Save</button>
                            </div>
                        </div>
                    </fieldset>
                </form>
            </div>
            
            <div class="clear"></div>
        </div>
    </div>
</div>
<script type="text/javascript">
    $(function() {
        $.validator.setDefaults({
            errorClass: "help-block",
            errorElement: "span",
            ignore: ".ignored,.btn,.chzn-choices input,.default,.search-field input,.chzn-search input",
            highlight: function(element) {
                $(element).closest('.control-group').removeClass('success').addClass('error');
            },
            success: function(element) {
                element.closest('.control-group').removeClass('error').addClass('success');
            },
            errorPlacement: function(error, element) {
                if (element.parent('.input-group').length || element.parent('.cleditorMain').length) {
                    error.insertAfter(element.parent());
                } else {
                    error.insertAfter(element);
                }
            }
        });

        var validator = $("#form_admin").validate({
            rules: {
                category_name: { required: true }
            }
        });
    });
</script>