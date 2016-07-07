<template>
    <div class="jstree">
        <ul class="jstree-container-ul jstree-wholerow-ul">
            <li class="jstree-node">
                <div class="jstree-wholerow">&nbsp;</div>
                <i class="jstree-icon jstree-ocl"></i>
                <a class="jstree-anchor" href="#">
                    <i class="jstree-icon jstree-undetermined"></i>
                    <i class="jstree-icon jstree-themeicon-custom fa fa-folder"></i>
                    Same but with checkboxes
                </a>
                <ul class="jstree-children">
                    <li class="jstree-node jstree-leaf">
                        <div class="jstree-wholerow jstree-wholerow-clicked jstree-wholerow-hovered">&nbsp;</div>
                        <i class="jstree-icon jstree-ocl"></i>
                        <a class="jstree-anchor jstree-clicked jstree-hovered" href="#">
                            <i class="jstree-icon jstree-checkbox"></i>
                            <i class="jstree-icon jstree-themeicon-custom fa fa-folder"></i>
                            initially selected
                        </a>
                    </li>
                    <li class="jstree-node jstree-leaf">
                        <div class="jstree-wholerow jstree-wholerow-clicked">&nbsp;</div>
                        <i class="jstree-icon jstree-ocl"></i>
                        <a class="jstree-anchor jstree-clicked" href="#">
                            <i class="jstree-icon jstree-checkbox"></i>
                            <i class="jstree-icon jstree-themeicon-custom fa fa-warning"></i>
                            custom icon
                        </a>
                    </li>
                    <li class="jstree-node jstree-closed">
                        <div class="jstree-wholerow jstree-wholerow-clicked">&nbsp;</div>
                        <i class="jstree-icon jstree-ocl"></i>
                        <a class="jstree-anchor jstree-clicked" href="#">
                            <i class="jstree-icon jstree-checkbox"></i>
                            <i class="jstree-icon fa fa-folder jstree-themeicon-custom"></i>
                            initially open
                        </a>
                        <ul class="jstree-children">
                            <li class="jstree-node jstree-leaf">
                                <div class="jstree-wholerow jstree-wholerow-clicked">&nbsp;</div>
                                <i class="jstree-icon jstree-ocl"></i>
                                <a class="jstree-anchor jstree-clicked" href="#">
                                    <i class="jstree-icon jstree-checkbox"></i>
                                    <i class="jstree-icon jstree-themeicon fa fa-folder icon-state-warning icon-lg jstree-themeicon-custom"></i>
                                    Another node
                                </a>
                            </li>
                        </ul>
                    </li>
                    <li class="jstree-node jstree-leaf">
                        <div class="jstree-wholerow">&nbsp;</div>
                        <i class="jstree-icon jstree-ocl"></i>
                        <a class="jstree-anchor" href="#">
                            <i class="jstree-icon jstree-checkbox"></i>
                            <i class="jstree-icon jstree-themeicon fa fa-warning icon-state-warning jstree-themeicon-custom"></i>
                            custom icon
                        </a>
                    </li>
                    <li class="jstree-node jstree-leaf">
                        <div class="jstree-wholerow jstree-wholerow-hovered">&nbsp;</div>
                        <i class="jstree-icon jstree-ocl"></i>
                        <a class="jstree-anchor jstree-disabled jstree-hovered" href="#">
                            <i class="jstree-icon jstree-checkbox"></i>
                            <i class="jstree-icon jstree-themeicon fa fa-check icon-state-success jstree-themeicon-custom"></i>
                            disabled node
                        </a>
                    </li>
                    <li class="jstree-node jstree-leaf">
                        <div class="jstree-wholerow jstree-wholerow-clicked jstree-wholerow-hovered">&nbsp;</div>
                        <i class="jstree-icon jstree-ocl"></i>
                        <a class="jstree-anchor jstree-disabled jstree-clicked jstree-hovered" href="#">
                            <i class="jstree-icon jstree-checkbox"></i>
                            <i class="jstree-icon jstree-themeicon fa fa-check icon-state-success jstree-themeicon-custom"></i>
                            disabled node
                        </a>
                    </li>
                </ul>
            </li>
            <li class="jstree-node jstree-leaf">
                <div class="jstree-wholerow jstree-wholerow-clicked">&nbsp;</div>
                <i class="jstree-icon jstree-ocl"></i>
                <a class="jstree-anchor jstree-clicked" href="#">
                    <i class="jstree-icon jstree-checkbox"></i>
                    <i class="jstree-icon jstree-themeicon fa fa-folder icon-state-warning icon-lg jstree-themeicon-custom"></i>
                    And wholerow selection
                </a>
            </li>
        </ul>
    </div>
</template>
<script>
    require("./css/css.scss");
    export default {
        data(){
            
        }
    }
</script>