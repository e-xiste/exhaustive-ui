import type { Preset } from '@exhaustive-ui/themes/types';
import type { MaterialBaseDesignTokens } from './base/index.d';

import accordion from '@exhaustive-ui/themes/material/accordion';
import autocomplete from '@exhaustive-ui/themes/material/autocomplete';
import avatar from '@exhaustive-ui/themes/material/avatar';
import badge from '@exhaustive-ui/themes/material/badge';
import base from '@exhaustive-ui/themes/material/base';
import blockui from '@exhaustive-ui/themes/material/blockui';
import breadcrumb from '@exhaustive-ui/themes/material/breadcrumb';
import button from '@exhaustive-ui/themes/material/button';
import card from '@exhaustive-ui/themes/material/card';
import carousel from '@exhaustive-ui/themes/material/carousel';
import cascadeselect from '@exhaustive-ui/themes/material/cascadeselect';
import checkbox from '@exhaustive-ui/themes/material/checkbox';
import chip from '@exhaustive-ui/themes/material/chip';
import colorpicker from '@exhaustive-ui/themes/material/colorpicker';
import confirmdialog from '@exhaustive-ui/themes/material/confirmdialog';
import confirmpopup from '@exhaustive-ui/themes/material/confirmpopup';
import contextmenu from '@exhaustive-ui/themes/material/contextmenu';
import datatable from '@exhaustive-ui/themes/material/datatable';
import dataview from '@exhaustive-ui/themes/material/dataview';
import datepicker from '@exhaustive-ui/themes/material/datepicker';
import dialog from '@exhaustive-ui/themes/material/dialog';
import divider from '@exhaustive-ui/themes/material/divider';
import dock from '@exhaustive-ui/themes/material/dock';
import drawer from '@exhaustive-ui/themes/material/drawer';
import editor from '@exhaustive-ui/themes/material/editor';
import fieldset from '@exhaustive-ui/themes/material/fieldset';
import fileinput from '@exhaustive-ui/themes/material/fileinput';
import fileupload from '@exhaustive-ui/themes/material/fileupload';
import floatlabel from '@exhaustive-ui/themes/material/floatlabel';
import galleria from '@exhaustive-ui/themes/material/galleria';
import iconfield from '@exhaustive-ui/themes/material/iconfield';
import iftalabel from '@exhaustive-ui/themes/material/iftalabel';
import image from '@exhaustive-ui/themes/material/image';
import imagecompare from '@exhaustive-ui/themes/material/imagecompare';
import inlinemessage from '@exhaustive-ui/themes/material/inlinemessage';
import inplace from '@exhaustive-ui/themes/material/inplace';
import inputchips from '@exhaustive-ui/themes/material/inputchips';
import inputgroup from '@exhaustive-ui/themes/material/inputgroup';
import inputnumber from '@exhaustive-ui/themes/material/inputnumber';
import inputotp from '@exhaustive-ui/themes/material/inputotp';
import inputtext from '@exhaustive-ui/themes/material/inputtext';
import knob from '@exhaustive-ui/themes/material/knob';
import listbox from '@exhaustive-ui/themes/material/listbox';
import megamenu from '@exhaustive-ui/themes/material/megamenu';
import mention from '@exhaustive-ui/themes/material/mention';
import menu from '@exhaustive-ui/themes/material/menu';
import menubar from '@exhaustive-ui/themes/material/menubar';
import message from '@exhaustive-ui/themes/material/message';
import metergroup from '@exhaustive-ui/themes/material/metergroup';
import multiselect from '@exhaustive-ui/themes/material/multiselect';
import orderlist from '@exhaustive-ui/themes/material/orderlist';
import organizationchart from '@exhaustive-ui/themes/material/organizationchart';
import overlaybadge from '@exhaustive-ui/themes/material/overlaybadge';
import paginator from '@exhaustive-ui/themes/material/paginator';
import panel from '@exhaustive-ui/themes/material/panel';
import panelmenu from '@exhaustive-ui/themes/material/panelmenu';
import password from '@exhaustive-ui/themes/material/password';
import picklist from '@exhaustive-ui/themes/material/picklist';
import popover from '@exhaustive-ui/themes/material/popover';
import progressbar from '@exhaustive-ui/themes/material/progressbar';
import progressspinner from '@exhaustive-ui/themes/material/progressspinner';
import radiobutton from '@exhaustive-ui/themes/material/radiobutton';
import rating from '@exhaustive-ui/themes/material/rating';
import ripple from '@exhaustive-ui/themes/material/ripple';
import scheduler from '@exhaustive-ui/themes/material/scheduler';
import scrollpanel from '@exhaustive-ui/themes/material/scrollpanel';
import select from '@exhaustive-ui/themes/material/select';
import selectbutton from '@exhaustive-ui/themes/material/selectbutton';
import skeleton from '@exhaustive-ui/themes/material/skeleton';
import slider from '@exhaustive-ui/themes/material/slider';
import speeddial from '@exhaustive-ui/themes/material/speeddial';
import splitbutton from '@exhaustive-ui/themes/material/splitbutton';
import splitter from '@exhaustive-ui/themes/material/splitter';
import stepper from '@exhaustive-ui/themes/material/stepper';
import steps from '@exhaustive-ui/themes/material/steps';
import tabmenu from '@exhaustive-ui/themes/material/tabmenu';
import tabs from '@exhaustive-ui/themes/material/tabs';
import tabview from '@exhaustive-ui/themes/material/tabview';
import tag from '@exhaustive-ui/themes/material/tag';
import terminal from '@exhaustive-ui/themes/material/terminal';
import textarea from '@exhaustive-ui/themes/material/textarea';
import tieredmenu from '@exhaustive-ui/themes/material/tieredmenu';
import timeline from '@exhaustive-ui/themes/material/timeline';
import toast from '@exhaustive-ui/themes/material/toast';
import togglebutton from '@exhaustive-ui/themes/material/togglebutton';
import toggleswitch from '@exhaustive-ui/themes/material/toggleswitch';
import toolbar from '@exhaustive-ui/themes/material/toolbar';
import tooltip from '@exhaustive-ui/themes/material/tooltip';
import tour from '@exhaustive-ui/themes/material/tour';
import tree from '@exhaustive-ui/themes/material/tree';
import treeselect from '@exhaustive-ui/themes/material/treeselect';
import treetable from '@exhaustive-ui/themes/material/treetable';
import virtualscroller from '@exhaustive-ui/themes/material/virtualscroller';

export default {
    ...base,
    components: {
        accordion,
        autocomplete,
        avatar,
        badge,
        blockui,
        breadcrumb,
        button,
        datepicker,
        card,
        carousel,
        cascadeselect,
        checkbox,
        chip,
        colorpicker,
        confirmdialog,
        confirmpopup,
        contextmenu,
        dataview,
        datatable,
        dialog,
        divider,
        dock,
        drawer,
        editor,
        fieldset,
        fileinput,
        fileupload,
        iftalabel,
        floatlabel,
        galleria,
        iconfield,
        image,
        imagecompare,
        inlinemessage,
        inplace,
        inputchips,
        inputgroup,
        inputnumber,
        inputotp,
        inputtext,
        knob,
        listbox,
        megamenu,
        mention,
        menu,
        menubar,
        message,
        metergroup,
        multiselect,
        orderlist,
        organizationchart,
        overlaybadge,
        popover,
        paginator,
        password,
        panel,
        panelmenu,
        picklist,
        progressbar,
        progressspinner,
        radiobutton,
        rating,
        ripple,
        scheduler,
        scrollpanel,
        select,
        selectbutton,
        skeleton,
        slider,
        speeddial,
        splitter,
        splitbutton,
        stepper,
        steps,
        tabmenu,
        tabs,
        tabview,
        textarea,
        tieredmenu,
        tag,
        terminal,
        timeline,
        togglebutton,
        toggleswitch,
        tree,
        treeselect,
        treetable,
        toast,
        toolbar,
        tooltip,
        tour,
        virtualscroller
    }
} satisfies Preset<MaterialBaseDesignTokens>;
