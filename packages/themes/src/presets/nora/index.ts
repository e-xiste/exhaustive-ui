import type { Preset } from '@exhaustive-ui/themes/types';
import type { NoraBaseDesignTokens } from './base/index.d';

import accordion from '@exhaustive-ui/themes/nora/accordion';
import autocomplete from '@exhaustive-ui/themes/nora/autocomplete';
import avatar from '@exhaustive-ui/themes/nora/avatar';
import badge from '@exhaustive-ui/themes/nora/badge';
import base from '@exhaustive-ui/themes/nora/base';
import blockui from '@exhaustive-ui/themes/nora/blockui';
import breadcrumb from '@exhaustive-ui/themes/nora/breadcrumb';
import button from '@exhaustive-ui/themes/nora/button';
import card from '@exhaustive-ui/themes/nora/card';
import carousel from '@exhaustive-ui/themes/nora/carousel';
import cascadeselect from '@exhaustive-ui/themes/nora/cascadeselect';
import checkbox from '@exhaustive-ui/themes/nora/checkbox';
import chip from '@exhaustive-ui/themes/nora/chip';
import colorpicker from '@exhaustive-ui/themes/nora/colorpicker';
import confirmdialog from '@exhaustive-ui/themes/nora/confirmdialog';
import confirmpopup from '@exhaustive-ui/themes/nora/confirmpopup';
import contextmenu from '@exhaustive-ui/themes/nora/contextmenu';
import datatable from '@exhaustive-ui/themes/nora/datatable';
import dataview from '@exhaustive-ui/themes/nora/dataview';
import datepicker from '@exhaustive-ui/themes/nora/datepicker';
import dialog from '@exhaustive-ui/themes/nora/dialog';
import divider from '@exhaustive-ui/themes/nora/divider';
import dock from '@exhaustive-ui/themes/nora/dock';
import drawer from '@exhaustive-ui/themes/nora/drawer';
import editor from '@exhaustive-ui/themes/nora/editor';
import fieldset from '@exhaustive-ui/themes/nora/fieldset';
import fileinput from '@exhaustive-ui/themes/nora/fileinput';
import fileupload from '@exhaustive-ui/themes/nora/fileupload';
import floatlabel from '@exhaustive-ui/themes/nora/floatlabel';
import galleria from '@exhaustive-ui/themes/nora/galleria';
import iconfield from '@exhaustive-ui/themes/nora/iconfield';
import iftalabel from '@exhaustive-ui/themes/nora/iftalabel';
import image from '@exhaustive-ui/themes/nora/image';
import imagecompare from '@exhaustive-ui/themes/nora/imagecompare';
import inlinemessage from '@exhaustive-ui/themes/nora/inlinemessage';
import inplace from '@exhaustive-ui/themes/nora/inplace';
import inputchips from '@exhaustive-ui/themes/nora/inputchips';
import inputgroup from '@exhaustive-ui/themes/nora/inputgroup';
import inputnumber from '@exhaustive-ui/themes/nora/inputnumber';
import inputotp from '@exhaustive-ui/themes/nora/inputotp';
import inputtext from '@exhaustive-ui/themes/nora/inputtext';
import kanban from '@exhaustive-ui/themes/nora/kanban';
import knob from '@exhaustive-ui/themes/nora/knob';
import listbox from '@exhaustive-ui/themes/nora/listbox';
import megamenu from '@exhaustive-ui/themes/nora/megamenu';
import mention from '@exhaustive-ui/themes/nora/mention';
import menu from '@exhaustive-ui/themes/nora/menu';
import menubar from '@exhaustive-ui/themes/nora/menubar';
import message from '@exhaustive-ui/themes/nora/message';
import metergroup from '@exhaustive-ui/themes/nora/metergroup';
import multiselect from '@exhaustive-ui/themes/nora/multiselect';
import orderlist from '@exhaustive-ui/themes/nora/orderlist';
import organizationchart from '@exhaustive-ui/themes/nora/organizationchart';
import overlaybadge from '@exhaustive-ui/themes/nora/overlaybadge';
import paginator from '@exhaustive-ui/themes/nora/paginator';
import panel from '@exhaustive-ui/themes/nora/panel';
import panelmenu from '@exhaustive-ui/themes/nora/panelmenu';
import password from '@exhaustive-ui/themes/nora/password';
import picklist from '@exhaustive-ui/themes/nora/picklist';
import popover from '@exhaustive-ui/themes/nora/popover';
import progressbar from '@exhaustive-ui/themes/nora/progressbar';
import progressspinner from '@exhaustive-ui/themes/nora/progressspinner';
import radiobutton from '@exhaustive-ui/themes/nora/radiobutton';
import rating from '@exhaustive-ui/themes/nora/rating';
import richtexteditor from '@exhaustive-ui/themes/nora/richtexteditor';
import ripple from '@exhaustive-ui/themes/nora/ripple';
import scheduler from '@exhaustive-ui/themes/nora/scheduler';
import scrollpanel from '@exhaustive-ui/themes/nora/scrollpanel';
import select from '@exhaustive-ui/themes/nora/select';
import selectbutton from '@exhaustive-ui/themes/nora/selectbutton';
import skeleton from '@exhaustive-ui/themes/nora/skeleton';
import slider from '@exhaustive-ui/themes/nora/slider';
import speeddial from '@exhaustive-ui/themes/nora/speeddial';
import splitbutton from '@exhaustive-ui/themes/nora/splitbutton';
import splitter from '@exhaustive-ui/themes/nora/splitter';
import stepper from '@exhaustive-ui/themes/nora/stepper';
import steps from '@exhaustive-ui/themes/nora/steps';
import tabmenu from '@exhaustive-ui/themes/nora/tabmenu';
import tabs from '@exhaustive-ui/themes/nora/tabs';
import tabview from '@exhaustive-ui/themes/nora/tabview';
import tag from '@exhaustive-ui/themes/nora/tag';
import terminal from '@exhaustive-ui/themes/nora/terminal';
import textarea from '@exhaustive-ui/themes/nora/textarea';
import tieredmenu from '@exhaustive-ui/themes/nora/tieredmenu';
import timeline from '@exhaustive-ui/themes/nora/timeline';
import toast from '@exhaustive-ui/themes/nora/toast';
import togglebutton from '@exhaustive-ui/themes/nora/togglebutton';
import toggleswitch from '@exhaustive-ui/themes/nora/toggleswitch';
import toolbar from '@exhaustive-ui/themes/nora/toolbar';
import tooltip from '@exhaustive-ui/themes/nora/tooltip';
import tour from '@exhaustive-ui/themes/nora/tour';
import tree from '@exhaustive-ui/themes/nora/tree';
import treeselect from '@exhaustive-ui/themes/nora/treeselect';
import treetable from '@exhaustive-ui/themes/nora/treetable';
import virtualscroller from '@exhaustive-ui/themes/nora/virtualscroller';

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
        kanban,
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
        richtexteditor,
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
} satisfies Preset<NoraBaseDesignTokens>;
