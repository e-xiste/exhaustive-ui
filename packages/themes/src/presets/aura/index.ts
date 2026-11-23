import type { Preset } from '@exhaustive-ui/themes/types';
import type { AuraBaseDesignTokens } from './base/index.d';

import accordion from '@exhaustive-ui/themes/aura/accordion';
import autocomplete from '@exhaustive-ui/themes/aura/autocomplete';
import avatar from '@exhaustive-ui/themes/aura/avatar';
import badge from '@exhaustive-ui/themes/aura/badge';
import base from '@exhaustive-ui/themes/aura/base';
import blockui from '@exhaustive-ui/themes/aura/blockui';
import breadcrumb from '@exhaustive-ui/themes/aura/breadcrumb';
import button from '@exhaustive-ui/themes/aura/button';
import card from '@exhaustive-ui/themes/aura/card';
import carousel from '@exhaustive-ui/themes/aura/carousel';
import cascadeselect from '@exhaustive-ui/themes/aura/cascadeselect';
import checkbox from '@exhaustive-ui/themes/aura/checkbox';
import chip from '@exhaustive-ui/themes/aura/chip';
import colorpicker from '@exhaustive-ui/themes/aura/colorpicker';
import confirmdialog from '@exhaustive-ui/themes/aura/confirmdialog';
import confirmpopup from '@exhaustive-ui/themes/aura/confirmpopup';
import contextmenu from '@exhaustive-ui/themes/aura/contextmenu';
import css from '@exhaustive-ui/themes/aura/css';
import datatable from '@exhaustive-ui/themes/aura/datatable';
import dataview from '@exhaustive-ui/themes/aura/dataview';
import datepicker from '@exhaustive-ui/themes/aura/datepicker';
import dialog from '@exhaustive-ui/themes/aura/dialog';
import divider from '@exhaustive-ui/themes/aura/divider';
import dock from '@exhaustive-ui/themes/aura/dock';
import drawer from '@exhaustive-ui/themes/aura/drawer';
import editor from '@exhaustive-ui/themes/aura/editor';
import fieldset from '@exhaustive-ui/themes/aura/fieldset';
import fileinput from '@exhaustive-ui/themes/aura/fileinput';
import fileupload from '@exhaustive-ui/themes/aura/fileupload';
import floatlabel from '@exhaustive-ui/themes/aura/floatlabel';
import galleria from '@exhaustive-ui/themes/aura/galleria';
import iconfield from '@exhaustive-ui/themes/aura/iconfield';
import iftalabel from '@exhaustive-ui/themes/aura/iftalabel';
import image from '@exhaustive-ui/themes/aura/image';
import imagecompare from '@exhaustive-ui/themes/aura/imagecompare';
import inlinemessage from '@exhaustive-ui/themes/aura/inlinemessage';
import inplace from '@exhaustive-ui/themes/aura/inplace';
import inputchips from '@exhaustive-ui/themes/aura/inputchips';
import inputgroup from '@exhaustive-ui/themes/aura/inputgroup';
import inputnumber from '@exhaustive-ui/themes/aura/inputnumber';
import inputotp from '@exhaustive-ui/themes/aura/inputotp';
import inputtext from '@exhaustive-ui/themes/aura/inputtext';
import kanban from '@exhaustive-ui/themes/aura/kanban';
import knob from '@exhaustive-ui/themes/aura/knob';
import listbox from '@exhaustive-ui/themes/aura/listbox';
import megamenu from '@exhaustive-ui/themes/aura/megamenu';
import menu from '@exhaustive-ui/themes/aura/menu';
import menubar from '@exhaustive-ui/themes/aura/menubar';
import message from '@exhaustive-ui/themes/aura/message';
import metergroup from '@exhaustive-ui/themes/aura/metergroup';
import multiselect from '@exhaustive-ui/themes/aura/multiselect';
import orderlist from '@exhaustive-ui/themes/aura/orderlist';
import organizationchart from '@exhaustive-ui/themes/aura/organizationchart';
import overlaybadge from '@exhaustive-ui/themes/aura/overlaybadge';
import paginator from '@exhaustive-ui/themes/aura/paginator';
import panel from '@exhaustive-ui/themes/aura/panel';
import panelmenu from '@exhaustive-ui/themes/aura/panelmenu';
import password from '@exhaustive-ui/themes/aura/password';
import picklist from '@exhaustive-ui/themes/aura/picklist';
import popover from '@exhaustive-ui/themes/aura/popover';
import progressbar from '@exhaustive-ui/themes/aura/progressbar';
import progressspinner from '@exhaustive-ui/themes/aura/progressspinner';
import radiobutton from '@exhaustive-ui/themes/aura/radiobutton';
import rating from '@exhaustive-ui/themes/aura/rating';
import ripple from '@exhaustive-ui/themes/aura/ripple';
import scrollpanel from '@exhaustive-ui/themes/aura/scrollpanel';
import select from '@exhaustive-ui/themes/aura/select';
import selectbutton from '@exhaustive-ui/themes/aura/selectbutton';
import skeleton from '@exhaustive-ui/themes/aura/skeleton';
import slider from '@exhaustive-ui/themes/aura/slider';
import speeddial from '@exhaustive-ui/themes/aura/speeddial';
import splitbutton from '@exhaustive-ui/themes/aura/splitbutton';
import splitter from '@exhaustive-ui/themes/aura/splitter';
import stepper from '@exhaustive-ui/themes/aura/stepper';
import steps from '@exhaustive-ui/themes/aura/steps';
import tabmenu from '@exhaustive-ui/themes/aura/tabmenu';
import tabs from '@exhaustive-ui/themes/aura/tabs';
import tabview from '@exhaustive-ui/themes/aura/tabview';
import tag from '@exhaustive-ui/themes/aura/tag';
import terminal from '@exhaustive-ui/themes/aura/terminal';
import textarea from '@exhaustive-ui/themes/aura/textarea';
import tieredmenu from '@exhaustive-ui/themes/aura/tieredmenu';
import timeline from '@exhaustive-ui/themes/aura/timeline';
import toast from '@exhaustive-ui/themes/aura/toast';
import togglebutton from '@exhaustive-ui/themes/aura/togglebutton';
import toggleswitch from '@exhaustive-ui/themes/aura/toggleswitch';
import toolbar from '@exhaustive-ui/themes/aura/toolbar';
import tooltip from '@exhaustive-ui/themes/aura/tooltip';
import tree from '@exhaustive-ui/themes/aura/tree';
import treeselect from '@exhaustive-ui/themes/aura/treeselect';
import treetable from '@exhaustive-ui/themes/aura/treetable';
import virtualscroller from '@exhaustive-ui/themes/aura/virtualscroller';

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
        card,
        carousel,
        cascadeselect,
        checkbox,
        chip,
        colorpicker,
        confirmdialog,
        confirmpopup,
        contextmenu,
        datatable,
        dataview,
        datepicker,
        dialog,
        divider,
        dock,
        drawer,
        editor,
        fieldset,
        fileinput,
        fileupload,
        floatlabel,
        galleria,
        iconfield,
        iftalabel,
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
        menu,
        menubar,
        message,
        metergroup,
        multiselect,
        orderlist,
        organizationchart,
        overlaybadge,
        paginator,
        panel,
        panelmenu,
        password,
        picklist,
        popover,
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
        splitbutton,
        splitter,
        stepper,
        steps,
        tabmenu,
        tabs,
        tabview,
        tag,
        terminal,
        textarea,
        tieredmenu,
        timeline,
        toast,
        togglebutton,
        toggleswitch,
        toolbar,
        tooltip,
        tree,
        treeselect,
        treetable,
        virtualscroller
    },
    css
} satisfies Preset<AuraBaseDesignTokens>;
