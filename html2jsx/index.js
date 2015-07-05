"use strict";

var cheerio = require("cheerio");
var fs = require("fs");
var del = require("del");
var mapping = require("./mapping.json");

// TODO: transform this to be used in gulp pipeline
var source = fs.readFileSync(__dirname+"/../html/index.html");
var outputDir = __dirname+"/../jsx/";
var tpl = fs.readFileSync(__dirname+"/tpl.jsx");

var $ = cheerio.load(source);

function parseNodes($, $node, _path){
  var nodes = [];

  $node = $node || $($("*")[0]);

  $node.find(" > ."+mapping.component.class).each(function( index ){

    var _node = {};
    _node.name = $(this).data(mapping.component.name);

    $(this).removeAttr("data-"+mapping.component.name);
    $(this).removeClass(mapping.component.class);
    if($(this).attr("class")!=""){
      $(this).attr("className",$(this).attr("class"))
    }
    $(this).removeAttr("class");
    //var _html =  $node(this).wrap('<'+_node.name+'/>').parent().html();
    var _html = $('<p></p>').append( $(this).clone() ).html()

    $(this).wrap("<"+_node.name+"/>").parent().html("");

    var $subSel = cheerio.load("<p>"+_html+"</p>");
    _node.nodes = parseNodes( $subSel, false, _path+"/"+_node.name);
    _node.render = $subSel($subSel("*")[0]).html();

    _node.path = _path;
    //console.log(_path, _node.name, _html);

    nodes.push(_node);
  })

  if(nodes.length == 0){
    $node.find(" > * ").each(function(){
      //var _html = $node('<div></div>').append( $node(this) ).html()
      nodes = nodes.concat(parseNodes($, $(this), _path));
    })
  }

  return nodes;
}

function translateNodes(nodes){
  var importStr = "";
  nodes.forEach(function(node){
    var _tpl = ""+tpl;

    importStr += "import "+node.name+" from './"+node.name+"/"+node.name+".jsx'\n"


    fs.mkdirSync(outputDir+node.path+"/"+node.name);

    node.importStr = ""
    if(node.nodes.length>0){
      node.importStr = translateNodes(node.nodes);
    }

    //console.log(node);
    _tpl = _tpl.replace(/_h2j_Import/g,node.importStr);
    _tpl = _tpl.replace(/_h2j_Name/g,node.name);
    _tpl = _tpl.replace(/_h2j_Render/g,node.render);
    fs.writeFileSync(outputDir+node.path+"/"+node.name+"/"+node.name+".jsx", _tpl);

  })

  return importStr;
}
var nodes = parseNodes($, false, "");

del.sync([outputDir]);
fs.mkdirSync(outputDir);

translateNodes(nodes);
