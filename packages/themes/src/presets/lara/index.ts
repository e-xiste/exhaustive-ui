import type { Preset } from '@exhaustive-ui/themes/types';
import type { LaraBaseDesignTokens } from './base/index.d';

import accordion from '@exhaustive-ui/themes/lara/accordion';
import autocomplete from '@exhaustive-ui/themes/lara/autocomplete';
import avatar from '@exhaustive-ui/themes/lara/avatar';
import badge from '@exhaustive-ui/themes/lara/badge';
import base from '@exhaustive-ui/themes/lara/base';
import blockui from '@exhaustive-ui/themes/lara/blockui';
import breadcrumb from '@exhaustive-ui/themes/lara/breadcrumb';
import button from '@exhaustive-ui/themes/lara/button';
import card from '@exhaustive-ui/themes/lara/card';
import carousel from '@exhaustive-ui/themes/lara/carousel';
import cascadeselect from '@exhaustive-ui/themes/lara/cascadeselect';
import checkbox from '@exhaustive-ui/themes/lara/checkbox';
import chip from '@exhaustive-ui/themes/lara/chip';
import colorpicker from '@exhaustive-ui/themes/lara/colorpicker';
import confirmdialog from '@exhaustive-ui/themes/lara/confirmdialog';
import confirmpopup from '@exhaustive-ui/themes/lara/confirmpopup';
import contextmenu from '@exhaustive-ui/themes/lara/contextmenu';
import datatable from '@exhaustive-ui/themes/lara/datatable';
import dataview from '@exhaustive-ui/themes/lara/dataview';
import datepicker from '@exhaustive-ui/themes/lara/datepicker';
import dialog from '@exhaustive-ui/themes/lara/dialog';
import divider from '@exhaustive-ui/themes/lara/divider';
import dock from '@exhaustive-ui/themes/lara/dock';
import drawer from '@exhaustive-ui/themes/lara/drawer';
import editor from '@exhaustive-ui/themes/lara/editor';
import fieldset from '@exhaustive-ui/themes/lara/fieldset';
import fileinput from '@exhaustive-ui/themes/lara/fileinput';
import fileupload from '@exhaustive-ui/themes/lara/fileupload';
import floatlabel from '@exhaustive-ui/themes/lara/floatlabel';
import galleria from '@exhaustive-ui/themes/lara/galleria';
import iconfield from '@exhaustive-ui/themes/lara/iconfield';
import iftalabel from '@exhaustive-ui/themes/lara/iftalabel';
import image from '@exhaustive-ui/themes/lara/image';
import imagecompare from '@exhaustive-ui/themes/lara/imagecompare';
import inlinemessage from '@exhaustive-ui/themes/lara/inlinemessage';
import inplace from '@exhaustive-ui/themes/lara/inplace';
import inputchips from '@exhaustive-ui/themes/lara/inputchips';
import inputgroup from '@exhaustive-ui/themes/lara/inputgroup';
import inputnumber from '@exhaustive-ui/themes/lara/inputnumber';
import inputotp from '@exhaustive-ui/themes/lara/inputotp';
import inputtext from '@exhaustive-ui/themes/lara/inputtext';
import knob from '@exhaustive-ui/themes/lara/knob';
import listbox from '@exhaustive-ui/themes/lara/listbox';
import megamenu from '@exhaustive-ui/themes/lara/megamenu';
import mention from '@exhaustive-ui/themes/lara/mention';
import menu from '@exhaustive-ui/themes/lara/menu';
import menubar from '@exhaustive-ui/themes/lara/menubar';
import message from '@exhaustive-ui/themes/lara/message';
import metergroup from '@exhaustive-ui/themes/lara/metergroup';
import multiselect from '@exhaustive-ui/themes/lara/multiselect';
import orderlist from '@exhaustive-ui/themes/lara/orderlist';
import organizationchart from '@exhaustive-ui/themes/lara/organizationchart';
import overlaybadge from '@exhaustive-ui/themes/lara/overlaybadge';
import paginator from '@exhaustive-ui/themes/lara/paginator';
import panel from '@exhaustive-ui/themes/lara/panel';
import panelmenu from '@exhaustive-ui/themes/lara/panelmenu';
import password from '@exhaustive-ui/themes/lara/password';
import picklist from '@exhaustive-ui/themes/lara/picklist';
import popover from '@exhaustive-ui/themes/lara/popover';
import progressbar from '@exhaustive-ui/themes/lara/progressbar';
import progressspinner from '@exhaustive-ui/themes/lara/progressspinner';
import radiobutton from '@exhaustive-ui/themes/lara/radiobutton';
import rating from '@exhaustive-ui/themes/lara/rating';
import ripple from '@exhaustive-ui/themes/lara/ripple';
import scrollpanel from '@exhaustive-ui/themes/lara/scrollpanel';
import select from '@exhaustive-ui/themes/lara/select';
import selectbutton from '@exhaustive-ui/themes/lara/selectbutton';
import skeleton from '@exhaustive-ui/themes/lara/skeleton';
import slider from '@exhaustive-ui/themes/lara/slider';
import speeddial from '@exhaustive-ui/themes/lara/speeddial';
import splitbutton from '@exhaustive-ui/themes/lara/splitbutton';
import splitter from '@exhaustive-ui/themes/lara/splitter';
import stepper from '@exhaustive-ui/themes/lara/stepper';
import steps from '@exhaustive-ui/themes/lara/steps';
import tabmenu from '@exhaustive-ui/themes/lara/tabmenu';
import tabs from '@exhaustive-ui/themes/lara/tabs';
import tabview from '@exhaustive-ui/themes/lara/tabview';
import tag from '@exhaustive-ui/themes/lara/tag';
import terminal from '@exhaustive-ui/themes/lara/terminal';
import textarea from '@exhaustive-ui/themes/lara/textarea';
import tieredmenu from '@exhaustive-ui/themes/lara/tieredmenu';
import timeline from '@exhaustive-ui/themes/lara/timeline';
import toast from '@exhaustive-ui/themes/lara/toast';
import togglebutton from '@exhaustive-ui/themes/lara/togglebutton';
import toggleswitch from '@exhaustive-ui/themes/lara/toggleswitch';
import toolbar from '@exhaustive-ui/themes/lara/toolbar';
import tooltip from '@exhaustive-ui/themes/lara/tooltip';
import tour from '@exhaustive-ui/themes/lara/tour';
import tree from '@exhaustive-ui/themes/lara/tree';
import treeselect from '@exhaustive-ui/themes/lara/treeselect';
import treetable from '@exhaustive-ui/themes/lara/treetable';
import virtualscroller from '@exhaustive-ui/themes/lara/virtualscroller';

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
} satisfies Preset<LaraBaseDesignTokens>;
