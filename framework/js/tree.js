
function menuTree(name,def){
	this.def=def;	
	this.format=def.format;	
	this.name=name;	
	this.num=0;	
	this.id='HSSTree'+name;
	this.nodes=[];
	this.root={"id":name+"_i"};		
	this.root.format=this.format;
	this.root.sub=def.sub;
	eval("window."+this.id+"=this");
	this.check_id = "HSS_i_";
	
	//the html code is written to the browser
	this.init=function(){
		this.code='';
		this.menuAct=new menuAction(this.name+'_back');		
		this._init(null,this.root,-1,0);				
      document.write(this.menuAct.draw(this.format.left,this.format.top,this.format.width,this.format.height,this.getp(this.root,"whole_bgcolor",0),0,1,this.getp(this.root,"whole_class",0),this.code,0));            
	};
	
	//html code for all the items is formed
	this._init=function(parent,node,lvl,num){			
			if(!node){
				return;
			}
			node.parent=parent; 			
			node.id=node.id||node.parent.id+"_"+num;
			node.lvl=lvl;
			node.ind=(this.num++)-1;			
			if(node!=this.root)
			{
				this.nodes[node.id]=node;
				var html_code=this.init_item(node);
				node.obj=new menuAction(node.id);				
				this.code+=(node.obj.draw(0,0,this.getp(node,"width","100%"),0,this.getp(node,"bgcolor",0),0,(1000-this.num),this.getp(node,"div_class",0),html_code));				
			}			
			if(node.sub){ 
				for(var i=0;i<node.sub.length;i++){ 
					this._init(node,node.sub[i], lvl+1,i);
				}
			}
		};
	
	//forming html attributes and values
	this.getp=function(n,name,def,nf)
	{	
		return this.format[name]||def
	};
	
	this.ident_code=function(n)
	{
		var ident=this.getp(n,"ident",parseInt(this.format.level_ident||16)*n.lvl-this.getp(n,"padding",0))||0;			
		return n.lvl&&ident?'<td><img src="'+this.format.b_image+'" width="'+ident+'" height="1"></td>':'';		
	};
	
	//forming html code for each items
	this.init_item=function(n)
	{
		var tc=this.getp(n,"table_class",0);
		var html_code ='<table width="'+this.getp(n,"width","100%")+'" cellpadding="'+this.getp(n,"padding",0)+'" cellspacing="'+this.getp(n,"spacing",0)+'" border="0"'+(tc?' class="'+tc+'"':'')+'><tr>';
		html_code+=this.ident_code(n);			
		var bgc=this.getp(n,"item_bgcolor",0);
		bgc=bgc?' bgcolor="'+bgc+'"':' ';
		var targ=n.target||this.format.target||0; 
		
		if (n.id.length == this.check_id.length+1)
		{
			tc=this.getp(n,"node_class_root",0);
		}
		else
		{
			tc=this.getp(n,"node_class_sub_node",0);
		}
		var lc=this.getp(n,"link_class",0);
		html_code+='<td width="100%"'+bgc+(tc?'class="'+tc+'"':'')+'><a '+(lc?'class="'+lc+'"':'')+'href="'+(n.url||'javascript:void(0)')+'"'+(n.sub?' onclick="if(this.blur)this.blur();'+this.id+'.togg(\''+n.id+'\')"':'onclick="if(this.blur)this.blur();'+this.id+'.toggSub(\''+n.id+'\')"')+(targ?' target="'+targ+'"':'')+'>'+n.html+'</a>'+'</td>';
		html_code+="</tr></table>";
		
		
		return html_code;
	};
	
	//closing a level in a tree
	this.close_level=function(p,n,l)
	{	
		if(l){
			//Close all the children of the node
			for(var i=0;i<n.sub.length;i++){
				if(n.sub[i].exp){					
					n.sub[i].exp=0;
					this.expand_collapse_children(n.sub[i],n.sub[i].obj.x,n.sub[i].obj.y,1,1);		
				}
			}
		}
		
		//Close all the children of the parent
		for(var i=0;i<p.sub.length;i++){
			if(p.sub[i]!=n&&p.sub[i].sub&&p.sub[i].exp){			
				p.sub[i].exp=0; 				
				this.expand_collapse_children(p.sub[i],p.sub[i].obj.x,p.sub[i].obj.y,1,1);
			}
		}
	};
	
	//event handler
	this.togg=function(id){	
	
			//Highlight the clicked node
			var n=this.nodes[id];
			var element = document.all(id);
	      element.style.backgroundColor = '#999999';	
	      
	      //Remove high light on the sibblings
	      for(var i=0;i<n.parent.sub.length;i++){
	      		
				if(n.parent.sub[i].id != id){	      		
					element = document.all(n.parent.sub[i].id);					
					element.style.backgroundColor = '';		
				}
			}
			
			//Remove high light on the children
			for(var i=0;i<n.sub.length;i++){
				      		
				if(n.sub[i].id != id){	      		
					element = document.all(n.sub[i].id);					
					element.style.backgroundColor = '';		
				}
			}			
			
			n.exp=!n.exp;			
			if(n.exp&&this.format.one_node_at_one_time){ 			
				this.close_level(n.parent,n,1);			
			}
			if(n.sub&&n.exp){//expand					
				this.expand_collapse_children(n,n.obj.x,n.obj.y,0,0);
			}
			if(n.sub&&!n.exp){//collapse				
				this.expand_collapse_children(n,n.obj.x,n.obj.y,1,1);
			}
			this.draw();
		};
		
		this.toggSub=function(id){
			var n=this.nodes[id];
			var element = document.all(id);
			
			//Close other branches
			if(this.format.one_node_at_one_time){ 			
				this.close_level(n.parent,n,0);			
			}
			
			//Remove high light on the sibblings
			for(var i=0;i<n.parent.sub.length;i++){
				if(n.parent.sub[i].id != id){	      		
					element = document.all(n.parent.sub[i].id);					
					element.style.backgroundColor = '';		
				}
			}
			
			element = document.all(id);
	      element.style.backgroundColor = '#999999';	
			this.draw();
		}
		
	
	//this function expands and collapses the tree
	this.expand_collapse_children=function(n,x,y,f,hide){		
	
			if(!n.obj.el) n.obj.init(this.menuAct);
			if(f)			
					n.obj.move(x,y);
					if(hide)n.obj.hide();					

			if(n.sub){
				for(var i=0;i<n.sub.length;i++){				
					this.expand_collapse_children(n.sub[i],x,y,1,hide)
				}
			}
		};
	
	this.draw=function(){			
			this.top=0;this.dnum=0;
			this._draw(this.root);		
		};

   //code for div		
	this._draw=function(n){
		this.last_drawed=n;
		this.dnum++;
		if(this.root!=n){
			if(!n.obj.el) n.obj.init();
			var ident=this.getp(n,"real_ident",0);
			
			if(ident!=n.obj.x||this.top.y!=n.obj.y) 
			{							
					n.obj.move(ident,this.top);
					n.obj.show();				
			}		
			this.top+=n.obj.h+this.getp(n,"offset_y",0);		
		}
		if(n.sub&&(n.exp||this.root==n))
			for(var i=0;i<n.sub.length;i++)
				this._draw(n.sub[i]);
	};
		
	this.init();
	this.draw();
	return this;
}

function menuAction(id)
{
	this.id=id;	
	this.name='menuAction'+this.id;
	
	this.init=function(){			
			this.el=document.all[this.id];			
			
			if(!this.el) return;
			this.css=this.el.style;			
			this.doc=document;
			this.x=parseInt(this.css.left)||this.css.pixelLeft||this.el.offsetLeft||0;
			this.y=parseInt(this.css.top)||this.css.pixelTop||this.el.offsetTop||0;
			this.w=this.el.offsetWidth||this.css.clip.width||this.doc.width||this.css.pixelWidth||0;
			this.h=this.el.offsetHeight||this.css.clip.height||this.doc.height||this.css.pixelHeight||0;
			this.h=this.h;
			this.w=this.w;			
		};	
	this.draw=function(x,y,w,h,bg,v,z,css,code,rel,mover,mout){
			return ('<div id="'+this.id+'" style="position:'+(rel?'relative':'absolute')+';z-index:'+z+';left:'+x+'px;top:'+y+'px;'+(w?'width:'+w+(w=='auto'?'':'px;'):'')+(h?'height:'+h+'px;':'')+(!v?'visibility:hidden;':'')+(bg!=""?''+''+'background-color:'+bg+';':'')+'"'+(css!=''?' class="'+css+'"':'')+'>'+code+'</div>')
		};
	this.move=function(x,y){			
			this.css.left=this.x=x;
			this.css.top=this.y=y;
		};
	this.show=function(){
			this.css.visibility="visible";
		};
	this.hide=function(){
			this.css.visibility="hidden";
		};
	
	eval(this.name+'=this');
	return this;
}
//LeftNav optimization.HSS#end

