
$(document).ready(function() {

    if($('.ordinal_egal').length>0){
        //case Ordinal_Egal

	// add property for the data transfer during Drag&Drop
	$.event.props.push('dataTransfer');

        /* update order and input for each candidate*/
        egal_update = function() {
            var tabItem = document.getElementById("liste").childNodes;
            for(var i = 0, c = 1, c_tmp, max = tabItem.length; i < max; i++) {
                if (tabItem[i].className == "cont") {
		    console.log("c = " + c);
                    c_tmp = c;
                    var tab = tabItem[i].childNodes;
                    for(var j = 0, max2 = tab.length, nb; j < max2; j++) {
                        if (tab[j].nodeType === 1) { //if candidate
                            nb = tab[j].id.substring(5,tab[j].id.length-1);
                            document.getElementById("option" + nb).value = c_tmp;
                            tab[j].firstChild.replaceChild(document.createTextNode(c_tmp),tab[j].firstChild.firstChild);
                            c++;
                        }
                    }
                }
            }    
        };


        /* function called by a click on a candidate unsorted */
        egal_choice =function(id){
            var fantome = document.getElementById("fant");
            if(fantome != null)
                fantome.parentNode.removeChild(fantome);
            var li = document.getElementById("item"+id);
            li.removeAttribute("onClick");
            var tabDiv = document.getElementById("resCont").childNodes;
            var i = 0;
            while(tabDiv[i] != null && tabDiv[i].nodeType !== 1)
                i++;
            var div = tabDiv[i];
            var tabInter = document.getElementById("resInter").childNodes;
            var j = 0;
            while(tabInter[j] != null && tabInter[j].nodeType !== 1)
                j++;	
            var new_inter = tabInter[j];
            var liste = document.getElementById("liste");
            div.appendChild(li);
            liste.appendChild(div);
            liste.appendChild(new_inter);

            egal_update();
        } ;



        $(document).ready(function() {
            var i, $THIS, data;


            //.item <-> draggable element (corresponding to a candidate)
            $('.ordinal_egal .item').on({
		
                // begin drag
                dragstart: function(e) {
                    var fantome = document.getElementById("fant");
                    if(fantome != null)
			fantome.parentNode.removeChild(fantome);
		    $THIS = $(this);
		    i = $(this.parentNode).index();
		    $(this).css('opacity', '0.4');

		    //candidate's value is stored
		    if(navigator.appName == "Microsoft Internet Explorer")
			e.dataTransfer.setData('text', $(this).text());	
		    else
			e.dataTransfer.setData('text/html', $(this).text());
		    data = this;
                },

                // on mouse over on a .item
                dragenter: function(e) {
                    e.preventDefault();
                },

                // mouse leaves the draggable object
                dragleave: function() {	
                },

                // called during the drag
                dragover: function(e) {
                    e.preventDefault();
                },

                // drop, drag end
                dragend: function() {
                    $(this).css('opacity', '1');
                }

            });


            //.inter <-> drop area between two candidates
            $('.ordinal_egal .inter').on({


                // on mouse over on a .inter
                dragenter: function(e) {
                    var fantome = document.createElement('li');
                    fantome.className = "fantome";
                    fantome.innerHTML = data.innerHTML;
                    this.appendChild(fantome);
                    $(this).css("height", "22px");
                    e.preventDefault();
                },

                // mouse leaves the draggable object .inter
                dragleave: function() {	    
                    this.removeChild(this.lastChild);
                    $(this).css("height", "9px");
                },


                //drop of a .item in a .inter (between two candidates)
                drop: function(e) {
                    this.removeChild(this.lastChild);
                    i = $(data.parentNode).index();
                    var i2 = $(this).index();
                    i2 = i2 > i ? i2-1 : i2+1 ;

                    var min = Math.min(i,i2), max = Math.max(i,i2);
                    var essai = $('.cont').toArray();
                    min = (min - min%2)/2;
                    max = (max - max%2)/2;
                    var sens = i2 > i ? 1 : -1;
                    var tmp = i2 > i ? min : max;
                    var cible = i2 > i ? max : min;

                    if( data.parentNode.id != "list_init" && essai[tmp].childNodes.length <= 1) {
			//shift
                        if (i !== i2) {
                            while(tmp != cible ){
                                var fils = essai[tmp + sens].childNodes;
                                for(var i = 0, c = fils.length; i < c; i++) {
                                    essai[tmp].appendChild(essai[tmp + sens].firstChild);
                                }
                                tmp += sens;
                            }
                            essai[cible].appendChild(data);
                        }
                    } else {
			//creation of a new  location
                        data.removeAttribute("onClick");
                        var inters= $('#liste .inter').toArray();
                        var tabDiv = document.getElementById("resCont").childNodes;
			
			console.log("length = " + tabDiv.length);

                        var i = 0;
                        while (tabDiv[i].nodeType !== 1)  {
			    console.log("node " + i + " - " + tabDiv[i]);
                            i++;
			}
			console.log("node " + i + " - " + tabDiv[i]);
                        var div = tabDiv[i];
                        var tabInter = document.getElementById("resInter").childNodes;
                        var j = 0;
                        while (tabInter[j].nodeType !== 1)
                            j++;	
                        var new_inter = tabInter[j];
                        var elem_suiv = inters[$(this).index() / 2];
                        div.appendChild(data);
                        elem_suiv.parentNode.insertBefore(new_inter,elem_suiv);
                        elem_suiv.parentNode.insertBefore(div,elem_suiv);

                    }
                    egal_update();

                    $(this).css("height", "9px");

                }

            });


            //.cont <-> drop area corresponding at a ranking (1st, 2nd, ...)
            $('.ordinal_egal .cont').on({

                // on mouse over on a .cont
                dragenter: function(e) {
                    i = $(data.parentNode).index();
                    var i2 = $(this).index();
                    if (i !== i2){
                        var fantome = document.createElement('li');
                        fantome.className = "fantome";
                        fantome.innerHTML = data.innerHTML;
                        this.appendChild(fantome);
                    }
                    e.preventDefault();
                },


                // mouse leaves the draggable object .cont
                dragleave: function() {	
                    i = $(data.parentNode).index();
                    var i2 = $(this).index();
                    if (i !== i2){
                        this.removeChild(this.lastChild);
                    }
                },


                //drop a .item on a .cont
                drop: function(e) {

                    if(data.parentNode.id != "list_init") {

                        i = $(data.parentNode).index();
                        var i2 = $(this).index();

                        var essai= $('.cont').toArray();

                        
                        if  (i !== i2) {
                            this.removeChild(this.lastChild);

                            var source =(i - i%2)/2;
                            var cible =(i2 - i2%2)/2;
                            var noeud_source=essai[source];
                            essai[cible].appendChild(data);
                            if(noeud_source.childNodes.length == 0) {
                                var inters= $('#liste .inter').toArray();
                                document.getElementById("resInter").appendChild(inters[(i-1)/2]);
                                document.getElementById("resCont").appendChild(noeud_source);
                            }
                        }
                    }else{
                        data.removeAttribute("onClick");
                        this.removeChild(this.lastChild);
                        this.appendChild(data);
                    }

                    egal_update();

                }

            });


        });



        /* when we fly over a candidate unsorted,
         * we create its ghostlike image at the end of the sorted list
         */

        $(".ordinal_egal .item").hover(

            function() {
                if(this.parentNode.id == "list_init") {
                    var fantome = this.cloneNode(true);
                    fantome.removeAttribute("onClick");
                    fantome.id = "fant";
                    fantome.className = "fantome";
                    document.getElementById("liste").appendChild(fantome);
                }
            }, 

            function() {
                var fantome = document.getElementById("fant");
                if(fantome != null)
		    fantome.parentNode.removeChild(fantome);
            }
        );




    }




    if($('.ordinal_strict').length>0){
        //ordinal_strict
	var colorTab = ["#c31616", "#e1dd38", "#b8da40"];
	var color = d3.scale.linear()
	    .domain([0, 0.5, 1])
	    .range(colorTab);	

        /* function called by a click on a candidate unsorted */
        strict_choice = function(id){
            var fantome = document.getElementById("fant");
            fantome.parentNode.removeChild(fantome);
            var li = document.getElementById("item"+id);
            li.removeAttribute("onClick");
            document.getElementById("sortable").appendChild(li);
            strict_update(document.getElementById("sortable"));
        };

        /* update order and input for each candidate*/
        strict_update = function(th){
            var tabItem = th.childNodes;
            for(var i = 0, c = 1, max = tabItem.length, nb; i < max; i++) {
                if (tabItem[i].nodeType === 1) {
                    tabItem[i].firstChild.firstChild.nodeValue = c + " - ";
                    tabItem[i].style.background = color(1 - c / nbCandidates);
                    nb = tabItem[i].id.substring(5,tabItem[i].id.length-1);
                    document.getElementById("option" + nb).value = c;	    
                    tabItem[i].firstChild.replaceChild(document.createTextNode(c),tabItem[i].firstChild.firstChild);
                    c++;
                }
            }

        };

	strict_update(document.getElementById("sortable"));

        $(function() {
            $( "#sortable" ).sortable({ //Sortable initialize
//                axis: "y", //movement in the the vertical axe
		placeholder: "fantome", // class of the ghostlike image
		update: function() {  // callback
                    strict_update(this);
		}
            });

            $( "#sortable" ).disableSelection();
            //we prevent selection
        });



        /* when we fly over a candidate unsorted,
         * we create its ghostlike image at the end of the sorted list
         */
        $(".ordinal_strict #init .item").hover(

            function() {
                if(this.parentNode.id == "list_init") {
                    var fantome = this.cloneNode(true);
                    fantome.removeAttribute("onClick");
                    fantome.id = "fant";
                    fantome.className = "fantome";
                    document.getElementById("sortable").appendChild(fantome);
                }
            }, 

            function() {
                if(this.parentNode.id == "list_init") {
                    var fantome = document.getElementById("fant");
                    fantome.parentNode.removeChild(fantome);
                }
            }
        );




    }


    if($('.ordinal_strict').length>0 || $('.ordinal_egal').length>0 ){
        /*
         * Images of arrows displayed when the mouse fly over the unsorted 
         * list or the sorted list
         */

        var form = document.getElementById('formulaire');

        form.addEventListener('submit', function(e) {
            var tabInit = document.getElementById("list_init").childNodes;
            var i = 0;
            while( i < tabInit.length && tabInit[i].nodeType !== 1)
		i++;
            if(i == tabInit.length)
		form.submit();
            else
		alert(unrankedCandidatesError);
            e.preventDefault();
        }, true);

        $("#init").hover(

            function() {
                $("#click_arrow").css("display","inline");
            }, 

            function() {
                $("#click_arrow").css("display","none");
            }
        );

        $("#res").hover(

            function() {
                $("#click_arrow").css('display','none');
                $("#drag_arrow").css("display","inline");
            }, 

            function() {
                $("#drag_arrow").css("display","none");
            }
        );


    }




    //Qualitatif

    if($('.qualitatif').length>0 ){


        var noteMax = parseInt((document.getElementById("maximum")).getAttribute("value"));
        var noteMin  = parseInt((document.getElementById("minimum")).getAttribute("value"));


        /*
         * The three following functions manages a simple poll (noteMin = 0)
         */

         noter = function(note, option){
             // note=1..noteMax
             // option=1..nbOption
 
             var tab_img = document.getElementsByClassName('opt'+option);
             /* Array of <img> 
              * this function will change the appearence of each star 
              * to represent the note
              */
             var i=1;
 
             /*
              * The following loop catches the unique element where className is 
              * like 'option'-'note'
              * This function will change the 'note' part
              */
             do {
                 var ligne = document.getElementsByClassName(String(option)+'-'+String(i));
                 i++;
             } while (ligne.length == 0);
 
 
             for (i=0; i<note; i++) {
                 tab_img[i].setAttribute("src","images/star-on.png");
             }
             for (i=note; i<noteMax; i++) {
                 tab_img[i].setAttribute("src","images/star-off.png");
             }
             ligne[0].setAttribute("class",option+'-'+note);
 
             // entree variable corresponds to the form input
             var entree = document.getElementById("option"+option);
             entree.setAttribute("value", String(note));
         };
 
        souris = function(note, option) {
            /*
             * This function is called on MouseOver event
             * It will change the appearence of each star of the give option
             * to represent the given note
             */
            var tab_img = document.getElementsByClassName('opt'+option);
            for (var i=0; i<note; i++) {
                tab_img[i].setAttribute("src","images/star-on.png");
            }
            for (var i=note; i<noteMax; i++) {
                tab_img[i].setAttribute("src","images/star-off.png");
            }
        };

//         retablir = function(option) {
//             /*
//              * This function is called on MouseOut event
//              * As the appearence of each star is changed on MouseOver event
//              * it should be reset as it was if the user didn't click
//              */
//             var i=1;
//             do {
// 
//                 var ligne = document.getElementsByClassName(String(option)+'-'+String(i));
//                 i++;
//             } while (ligne.length == 0);
//             var note = (ligne[0]).getAttribute("class");
//             note = note.substring(note.indexOf('-')+1);
//             note = parseInt(note);
//             noter(note,option);
//         };
// 
        /*
         * The four following functions are related to bipolar polls (noteMin<0)
         */

        function afficher(note, option) {
            // note = noteMin..noteMax
            // option = 1..nbOption

            /*
             * This function changes the appearences of each icons of the given option to represent the given note
             */

            var tab_img_negatif = document.getElementsByClassName('negatif'+option);
            var tab_img_positif = document.getElementsByClassName('positif'+option);
            var tab_img_neutre = document.getElementsByClassName('neutre'+option);

            if (note == 0) {
                for (var indice=0; indice < -noteMin; indice++) {
                    tab_img_negatif[indice].setAttribute("src",
							 "images/red.png");
                    tab_img_negatif[indice].style.opacity = 0.2;
                }
                tab_img_neutre[0].setAttribute("src",
					       "images/neutral.png");
                for (indice=0; indice < noteMax; indice++) {
                    tab_img_positif[indice].setAttribute("src",
							 "images/green.png");
                    tab_img_positif[indice].style.opacity = 0.2;
                }
            }
            else if (note > 0) {
                for (var indice=0; indice < -noteMin; indice++) {

                    tab_img_negatif[indice].setAttribute("src",
							 "images/red.png");
                    tab_img_negatif[indice].style.opacity = 0.2;
                }
                tab_img_neutre[0].setAttribute("src",
					       "images/neutral.png");
                for (indice=0; indice < note; indice++) {
                    tab_img_positif[indice].setAttribute("src",
							 "images/plus.png");
                    tab_img_positif[indice].style.opacity = 1;
                }
                for (indice=note; indice < noteMax; indice++) {
                    tab_img_positif[indice].setAttribute("src",
							 "images/green.png");
                    tab_img_positif[indice].style.opacity = 0.2;
                }
            }
            else {
                //note < 0
                for (indice=0; indice < noteMax; indice++) {
                    tab_img_positif[indice].setAttribute("src",
							 "images/green.png");
                    tab_img_positif[indice].style.opacity = 0.2;
                }
                tab_img_neutre[0].setAttribute("src",
					       "images/neutral.png");
                for (indice=-noteMin -1; indice>note-noteMin-1; indice--) {
                    tab_img_negatif[indice].setAttribute("src",
							 "images/minus.png");
                    tab_img_negatif[indice].style.opacity = 1;
                }
                for (indice=0; indice<=note-noteMin-1; indice++) {
                    tab_img_negatif[indice].setAttribute("src",
							 "images/red.png");
                    tab_img_negatif[indice].style.opacity = 0.2;
                }
            }
        }    

        binoter = function(note,option){
            /*
             * This function is called on click event
             * it'll change the form imput value and the appearence of icons
             */
            /*var i = noteMin;
            do {
                var ligne = document.getElementsByClassName(option+'-note='+String(i));
                i++;
            } while (ligne.length == 0);
            ligne[0].setAttribute("class", option+'-note='+note);*/
            var entree = document.getElementById("option"+option);
            entree.setAttribute("value", labels[note]);
            afficher(note,option);
        };

        bisouris = function(note,option) {
            /*
             * This function is called on mouseOver event
             * it'll change the appearence of icons 
             */
            afficher(note,option);
        };

        biretablir = function(option){
            /*
             * This function is called on mouseOut event
             * it'll reset the appearence as it was before the MouseOver event 
             * if the user didn't click
             */
/*            var i = noteMin;
            do {

                var ligne = document.getElementsByClassName(option+'-note='+String(i));
                i++;
            } while (i <= 100 && ligne.length == 0);

            var note = ligne[0].getAttribute("class");
            note = note.substring(note.indexOf("note=")+5);
            note = parseInt(note);*/
	    var note = inverseLabels[document.getElementById("option" + option).value];
            binoter(note,option);
        };

	// At page initialization, we initialize the buttons with the values that are
	// in the corresponding hidden input fields (themselves set up by the Servlet)
	for (var i = 0; document.getElementById("option" + i) != null; i++) {
	    biretablir(i);
	}
    }



    if($('.binaire').length>0 ){

        document.getElementById("button-checkbox").checked = false;


        changecolor =function(id_drag) //change yes->no(green->red) or no->yes(red->green) 
        {
            if (document.getElementById(id_drag).className == "non")
            {
                document.getElementById(id_drag).className = "oui";
                document.getElementById("option" + id_drag).value = 1;
            }
            else
            {
                document.getElementById(id_drag).className = "non";
                document.getElementById("option" + id_drag).value = 0;
            }

            return false;
        }


        toutoui = function(id_blanc) //every option become yes (green) if you click on oui
        { 

            var paragraph = document.getElementById("tab");

            var children = paragraph.childNodes;

            for (var i = 0, c = children.length; i<c; i++) {
                if (children[i].className == "non") {
                    children[i].className ="oui";
                    document.getElementById("option" + children[i].id ).value = 1;
                }

            }

        }

        toutnon = function(id_blanc)  //every option become no (red) if you click on non
        { 
            var paragraph = document.getElementById("tab");

            var children = paragraph.childNodes;

            for (var i = 0, c = children.length; i<c; i++) {
                if (children[i].className == "oui") {
                    children[i].className ="non";
                    document.getElementById("option" + children[i].id ).value = 0;
                }
            }
            return false;
        }


        sansclick =function()  //change yes-no or no-yes if mouseover an option, without a click.
        {

            var paragraph = document.getElementById("tab");
            var children = paragraph.childNodes;

            if (!document.getElementById("button-checkbox").checked)
            {    
                for (var i = 0, c = children.length; i<c; i++) {
		    if (children[i].className == "oui" || children[i].className == "non") {
                        children[i].removeAttribute("onMouseOver");
                        children[i].setAttribute("onclick","changecolor(" + children[i].id + ")");

                    }
                }
            }else{
                for (var i = 0, c = children.length; i<c; i++) {
                    if (children[i].className == "oui" || children[i].className == "non") {
                        children[i].removeAttribute("onClick");
                        children[i].setAttribute("onmouseover","changecolor(" + children[i].id + ")");
                    }
                }
            }
        }




    }















    if($('.quantitatif').length>0 ){
        $("#res").hover(
            window.oncontextmenu = function ()
            {
                return false;     // cancel default menu of right click
            });
        //this function re-draws the rectangles on empty columns
        function glisser(nb_cases){
            var cercles = svg.selectAll("circle");
            //it sorts the array of circles
            cercles[0].sort(function(a,b){return a.cx.baseVal.value - b.cx.baseVal.value});
            var nb_pleines =cercles[0].length;
            //an array containing the positions of all columns containing a point
            var ind_col = Array(nb_pleines);
            var q =0;
            //an array containing the y coordinates of each column's left border
            var limg = new Array(nb_cases);
            //an array containing the y coordinates of each column's right border
            var limd = new Array(nb_cases);
            for(var a=0;a<nb_cases-1;a++){
                limg[a] = a*100;
                limd[a] = (a+1)*100-1;
            }
            limg[nb_cases-1] = (nb_cases-1)*100;
            limd[nb_cases-1] = nb_cases*100;
            for(var k=0; k< nb_pleines;k++){
                var kcx = cercles[0][k].cx.baseVal.value;
                for(var w=q;w<nb_cases;w++){
                    if(limg[w]<= kcx && kcx <= limd[w]){
                        ind_col[k] = w;
                        q = w+1;
                        break;
                    }
                }
            }
            //re-drawing the rectangles
            if(nb_pleines>1){
                for(var e = 0; e<nb_pleines-1; e++){
                    var c1 = cercles[0][e];
                    var c2 = cercles[0][e+1];
                    var cx1 = c1.cx.baseVal.value;
                    var cx2 = c2.cx.baseVal.value;
                    var cy1 = c1.cy.baseVal.value;
                    var cy2 = c2.cy.baseVal.value;
                    for(var f=ind_col[e]+1;f<ind_col[e+1] ;f++){
                        var cx0 = Math.round((limg[f]+limd[f])/2);
                        var cy0 = cy1+((cy2-cy1)/(cx2-cx1))*(cx0-cx1);
                        var h;
                        var col;
                        var coord_y;
                        var y_arr = Math.round(cy0);
                        var y_div = y_arr/50;
                        var y_div_arr = Math.round(y_div);
                        var y_nouv = y_div_arr*50;
                        if(y_nouv>=max){
                            h = y_nouv - max;	
                            col ="#FF0033";
                            coord_y = max;
                            maj(cx0-50,-h);
                        }else{
                            h = max - y_nouv;
                            col = "#0099FF";
                            coord_y = y_nouv;
                            maj(cx0-50,h);
                        }
                        svg.append("rect")
                            .attr("x",cx0-50)
                            .attr("y",coord_y)
                            .attr("width",100)
                            .attr("height",h)
                            .style("fill",col)
                            .classed("vide",true);
                    }
                }	
            }
            //re-ordering the chart
            var lig = svg.selectAll(".poly");
            var l0 = lig[0];
            for(var i=0; i<l0.length;i++){
                var li = l0[i];
                li.parentNode.appendChild(li);	
            }
            var cercles = svg.selectAll("circle");
            var c0 = cercles[0];
            for(var i=0; i<c0.length;i++){
                var ci = c0[i];
                ci.parentNode.appendChild(ci);	
            }
        }
        //this function draws the lines between circles
        liaison =function(cercles){
            //it removes all the lines and rectangles (on empty columns)
            var lig = svg.selectAll(".poly");
            lig.remove();
            var vides = svg.selectAll(".vide");
            vides.remove();
            cercles[0].sort(function(a,b){return a.cx.baseVal.value - b.cx.baseVal.value});
            //it re-draws the lines between each circle
            for(var k =0; k< cercles[0].length-1;k++){
                var xg = cercles[0][k].cx.baseVal.value;
                var yg = cercles[0][k].cy.baseVal.value;
                var xd = cercles[0][k+1].cx.baseVal.value;
                var yd = cercles[0][k+1].cy.baseVal.value;
                svg.append("line")
                    .attr("x1",xg)
                    .attr("y1",yg)
                    .attr("x2",xd)
                    .attr("y2",yd)
                    .classed("poly",true)
                    .style("stroke-width",2)
                    .style("stroke", "green");
            }
            //it re-draws the missing rectangles
            glisser(opt);
        }
        //the svg element
        var svg = d3.select("#svg");
        //this function updates the values of the form's inputs
        function maj(x,y){
            var pos_x = Math.floor(x/100)+1;
            var pos_y = y/50;
            document.getElementById("option"+pos_x).value = pos_y;
        }
        //function that deletes points
        function supp(c){
            var cercles = svg.selectAll("circle");
            //sorts the array of circles
            cercles[0].sort(function(a,b){return a.cx.baseVal.value - b.cx.baseVal.value});
            var lig = svg.selectAll(".poly");
            //sorts the array of lines
            lig[0].sort(function(a,b){return a.x1.baseVal.value - b.x1.baseVal.value});
            var vide = svg.selectAll(".vide");
            var rect = svg.selectAll(".temp");
            //sorts the array of rectangles
            rect[0].sort(function(a,b){return a.x.baseVal.value - b.x.baseVal.value});
            var i;
            //finds the position of the circle to be deleted
            for(i=0;i<cercles[0].length;i++){
                if(cercles[0][i].cx.baseVal.value == c.cx.baseVal.value)
                    break;
            }//it removes it
            c.parentNode.removeChild(c);
            //it removes the adjacent rectangle
            rect[0][i].parentNode.removeChild(rect[0][i]);
            //it removes all the lines 
            lig.remove();;
            //it removes all he rectangles on empty columns
            vide.remove();
            var cercles = svg.selectAll("circle");
            //it re-draws the lines
            liaison(cercles);
            //and the rectangles
            glisser(opt);
        }
        //if the default variable is an array, then the chart must be initialised according to the data in that array
        var cercles = svg.selectAll("circle");
        var longueur_non_nulle = cercles[0].length!=0;
        if(longueur_non_nulle){
            var cer_tab = new Array(cercles[0].length);
            for(var t=0;t<cercles[0].length;t++){
                cer_tab[t] = cercles[0][t].cy.baseVal.value;
                cercles[0][t].parentNode.removeChild(cercles[0][t]);
            }
            for(var t=0;t<cer_tab.length;t++){
                if(t == 0 || t== cer_tab.length-1){
                    svg.append("circle")
                        .attr("cx",t*100+50)
                        .attr("cy",cer_tab[t])
                        .attr("r",7)
                        .style("fill","black")
                        .call(d3.behavior.drag().on("drag",function(){
                            this.parentNode.appendChild(this);
                            var dragTarget = d3.select(this);
                            var nb_cases = opt;
                            glisser_principale(dragTarget,nb_cases);
                        }))
			.on("mouseup",function(){
                            var y_arr = Math.round(y);
                            var y_div = y_arr/50;
                            var y_div_arr = Math.round(y_div);
                            var y_nouv = y_div_arr*50;
                            //this.setAttribute("cy",y_nouv);
                            this.cy = y_nouv;
                            var cercles = svg.selectAll("circle");
                            liaison(cercles);
			});
                }else{
                    svg.append("circle")
                        .attr("cx",t*100+50)
                        .attr("cy",cer_tab[t])
                        .attr("r",7)
                        .style("fill","black")
                        .call(d3.behavior.drag().on("drag",function(){
                            this.parentNode.appendChild(this);
                            var dragTarget = d3.select(this);
                            var nb_cases = opt;
                            glisser_principale(dragTarget,nb_cases);
                        }))
			.on("mouseup",function(){
                            var y_arr = Math.round(y);
                            var y_div = y_arr/50;
                            var y_div_arr = Math.round(y_div);
                            var y_nouv = y_div_arr*50;
                            //this.setAttribute("cy",y_nouv);
                            this.cy = y_nouv;
                            var cercles = svg.selectAll("circle");
                            liaison(cercles);
			})
			.on("contextmenu",function(evt){
                            supp(this);
			});
                }
                var h;
                var col;
                var coord_y;
                if(cer_tab[t]>=max){
                    h = cer_tab[t] - max;	
                    col ="#FF0033";
                    coord_y = max;
                }else{
                    h = max - cer_tab[t];
                    col = "#0099FF";
                    coord_y = cer_tab[t];
                }
                svg.append("rect")
                    .attr("x",t*100)
                    .attr("y",coord_y)
                    .attr("width",100)
                    .attr("height",h)
                    .style("fill",col)
                    .classed("temp",true);
                maj(t*100,max-cer_tab[t]);
            }
            var cercles = svg.selectAll("circle");
            liaison(cercles);

            //if $default is not an array then we draw the second circle and the line between it and the first one (which is drawn at the end of this file) 
        }else if(opt>1){
            var x = opt*100 - 50
            svg.append("circle")
                .attr("cx",x)
                .attr("cy",max)
                .attr("r",7)
                .style("fill","black")
                .call(d3.behavior.drag().on("drag",function(){
                    this.parentNode.appendChild(this);
                    var dragTarget = d3.select(this);
                    var nb_cases = opt;
                    glisser_principale(dragTarget,nb_cases);
                }))
		.on("mouseup",function(){
                    var y_arr = Math.round(y);
                    var y_div = y_arr/50;
                    var y_div_arr = Math.round(y_div);
                    var y_nouv = y_div_arr*50;
                    //this.setAttribute("cy",y_nouv);
                    this.cy = y_nouv;
                    var cercles = svg.selectAll("circle");
                    liaison(cercles);
		})
            ;

            svg.append("rect")
                .attr("x",x)
                .attr("y",max)
                .attr("width",100)
                .attr("height",0)
                .style("fill","#FF0033")
                .classed("temp",true);
            maj(x,0);
            svg.append("line")
                .attr("x1",50)
                .attr("y1",max)
                .attr("x2",x)
                .attr("y2",max)
                .classed("poly",true)
                .style("stroke-width", 2)
                .style("stroke", "green");
            //re-ordering lines and circles
            var lig = svg.selectAll(".poly");
            var l0 = lig[0];
            for(var i=0; i<l0.length;i++){
                var li = l0[i];
                li.parentNode.appendChild(li);	
            }
            var cercles = svg.selectAll("circle");
            var c0 = cercles[0];
            for(var i=0; i<c0.length;i++){
                var ci = c0[i];
                ci.parentNode.appendChild(ci);	
            }
        }


        //this function is called whenever the user drags a circle
        function glisser_principale(dragTarget,nb_cases){
            var limg;
            var limd;
            //the position of the circle before moving
            var ay = parseInt(dragTarget.attr("cy"));
            //the position of the circle after moving
            var ny = d3.event.dy + parseInt(dragTarget.attr("cy"));
            //if the new position does not surpass the borders
            var condy = 0 <= parseInt(ny) && parseInt(ny) <= taille_totale;
            dragTarget.attr("cy", function(){
                if(condy)return ny;else return ay;
            });
            var r_temp = svg.selectAll(".temp");
            var cercles = svg.selectAll("circle");
            //it eliminates all the rectangles adjacent to the circles
            r_temp.remove();
            //it re-draws the lines
            liaison(cercles);
            var cercles = svg.selectAll("circle");
            for(var k = 0; k < cercles[0].length;k++){
                var cerclek = cercles[0][k];
                var x = cerclek.cx.baseVal.value;
                var y = cerclek.cy.baseVal.value;
                //puts the boers' y coordinates in arrays
                var limg = new Array(nb_cases);
                var limd = new Array(nb_cases);
                for(var a=0;a<nb_cases-1;a++){
                    limg[a] = a*100;
                    limd[a] = (a+1)*100-1;
                }
                limg[nb_cases-1] = (nb_cases-1)*100;
                limd[nb_cases-1] = nb_cases*100;
                var lg;
                //finds the column where the dragged circle belongs
                for(var t=0;t<nb_cases;t++){
                    if(limg[t]<= x && x<= limd[t]){
                        lg = limg[t];
                        break;		
                    }
                }
                //calculates the new position of the adjacent rectangle
                var y_arr = Math.round(y);
                var y_div = y_arr/50;
                var y_div_arr = Math.round(y_div);
                var y_nouv = y_div_arr*50;
                if(y_nouv >=max){
                    svg.append("rect")
                        .attr("x",lg)
                        .attr("y",max)
                        .attr("width",100)
                        .attr("height",y_nouv-max)
                        .style("fill","#FF0033")
                        .classed("temp",true);
                }else{
                    svg.append("rect")
                        .attr("x",lg)
                        .attr("y",y_nouv)
                        .attr("width",100)
                        .attr("height",max-y_nouv)
                        .style("fill","#0099FF")
                        .classed("temp",true);
                }
                //updates the inputs
                maj(lg,max-y_nouv);
            }
            //updates the rectangles situated on columns with no circle
            glisser(nb_cases);

        }


        //the function that is called when clicking a circle (point)
        $("svg").on("click",function(evt){
            var cercles = svg.selectAll("circle");
            //the last circle added
            var der_cer = cercles[0][Math.max(0,cercles[0].length-1)];
            var cond =(der_cer!=null);
            var nb_cases = opt;
            //inserting the y coordinates of the borders in arrays
            var limg = new Array(nb_cases);
            var limd = new Array(nb_cases);
            for(var a=0;a<nb_cases-1;a++){
                limg[a] = a*100;
                limd[a] = (a+1)*100-1;
            }
            limg[nb_cases-1] = (nb_cases-1)*100;
            limd[nb_cases-1] = nb_cases*100;
            //the rectangles which are adjacent to the circles
            var rtemp = svg.selectAll(".temp");
            //the position of the click
            var x = evt.pageX - $('#svg').offset().left - 1;
            var y = evt.pageY - $('#svg').offset().top - 1;
            //searching for the position of the clicked circle
            for(var i=0;i<nb_cases;i++){
                if(limg[i]<=x && x<=limd[i] &&  0 <= y && y <= taille_totale){
                    for(var j = 0; j<cercles[0].length;j++){
                        var c = cercles[0][j];
                        var cx = c.cx.baseVal.value;
                        if(limg[i]<=cx && cx <= limd[i])
                        {
                            //deleting the circle and its adjacent rectangle
                            cercles[0][j].parentNode.removeChild(cercles[0][j]);
                            rtemp[0][j].parentNode.removeChild(rtemp[0][j]);
                        }
                    }
                }
            }
            //lg contains the left vertical limit of the column the circle belongs to
            var lg;
            //ld the right
            var ld;
            for(var t=0;t<nb_cases;t++){
                if(limg[t]<= x && x<= limd[t]){
                    lg = limg[t];
                    ld = limd[t];
                    break;		
                }
            }
            //if the click is within the column
            if(limg[0]<= x && x <= limd[nb_cases-1] && 0<= y && y <= taille_totale){
                var y_arr = Math.round(y);
                var y_div = y_arr/50;
                var y_div_arr = Math.round(y_div);
                var y_nouv = y_div_arr*50;
                //we add the new adjacent rectangle
                if(y_nouv >=max){
                    svg.append("rect")
                        .attr("x",lg)
                        .attr("y",max)
                        .attr("width",100)
                        .attr("height",y_nouv-max)
                        .style("fill","#FF0033")
                        .classed("temp",true);
                }else{
                    svg.append("rect")
                        .attr("x",lg)
                        .attr("y",y_nouv)
                        .attr("width",100)
                        .attr("height",max-y_nouv)
                        .style("fill","#0099FF")
                        .classed("temp",true);
                }
                //we update the inputs' values
                maj(lg,max-y_nouv);
                //if the clicked circle is not situated in the first or last column
                if(lg != limg[0] && lg != limg[nb_cases-1] && ld != limd[0] && ld != limd[nb_cases-1])
                    //we replace the clicked circle with a circle that can be deleted
                    svg.append("circle")
                    .attr("cx",(lg+ld)/2)
                    .attr("cy",y_nouv)
                    .attr("r",7)
                    .style("fill","black")
                    .call(d3.behavior.drag().on("drag",function(){
                        this.parentNode.appendChild(this);
                        var dragTarget = d3.select(this);
                        glisser_principale(dragTarget,nb_cases);
                    }
					       ))
                    .on("mouseup",function(){
                        var y_arr = Math.round(y);
                        var y_div = y_arr/50;
                        var y_div_arr = Math.round(y_div);
                        var y_nouv = y_div_arr*50;
                        //this.setAttribute("cy",y_nouv);
                        this.cy = y_nouv;
                        var cercles = svg.selectAll("circle");
                        liaison(cercles);
                    })
                    .on("contextmenu",function(evt){
			//var rightclick;
			//if (this.which) rightclick = (evt.which == 3);
			//else if (this.button) rightclick = (evt.button == 2);
			supp(this);
                    });
                //if not the circle cannot be deleted
                else
                    svg.append("circle")
                    .attr("cx",(lg+ld)/2)
                    .attr("cy",y_nouv)
                    .attr("r",7)
                    .style("fill","black")
                    .call(d3.behavior.drag().on("drag",function(){
                        this.parentNode.appendChild(this);
                        var dragTarget = d3.select(this);
                        glisser_principale(dragTarget,nb_cases);
                    }
					       ))
                    .on("mouseup",function(){
                        var y_arr = Math.round(y);
                        var y_div = y_arr/50;
                        var y_div_arr = Math.round(y_div);
                        var y_nouv = y_div_arr*50;
                        //this.setAttribute("cy",y_nouv);
                        this.cy = y_nouv;
                        var cercles = svg.selectAll("circle");
                        liaison(cercles);
                    });
                var cercles = svg.selectAll("circle");
                var der_cer = cercles[0][Math.max(0,cercles[0].length-1)];
                var cond = (der_cer!=null);
                var y = der_cer.cy.baseVal.value;
                //we draw the lines
                liaison(cercles);
                //we draw the rectangles on the empty columns
                glisser(nb_cases);
            }
        }
		   );
        //if $default is not an array we add the first circle

        if(!longueur_non_nulle){
            svg.append("circle")
                .attr("cx",50)
                .attr("cy",max)
                .attr("r",7)
                .style("fill","black")
                .call(d3.behavior.drag().on("drag",function(){
                    this.parentNode.appendChild(this);
                    var dragTarget = d3.select(this);
                    var nb_cases = opt;
                    glisser_principale(dragTarget,nb_cases);
                }))
		.on("mouseup",function(){
                    var y_arr = Math.round(y);
                    var y_div = y_arr/50;
                    var y_div_arr = Math.round(y_div);
                    var y_nouv = y_div_arr*50;
                    //this.setAttribute("cy",y_nouv);
                    this.cy.baseVal.value = y_nouv;
                    var cercles = svg.selectAll("circle");
                    liaison(cercles);
		})
            ;

            svg.append("rect")
                .attr("x",0)
                .attr("y",max)
                .attr("width",100)
                .attr("height",0)
                .style("fill","#FF0033")
                .classed("temp",true);
        }


    }

    
    if($('.quantitatif2').length>0){
	$(function() {
	    for(var i = 1; i <= opt; i++) {
		$( "#slider-vertical"+i ).slider({
		    orientation: "vertical",
		    range: "min",
		    min: min,
		    max: max,
		    value: $("#option" + i).val(),
		    slide: function( event, ui ) {
			var nb = this.id.substring(16,this.id.length-1);
			$( "#option" + nb ).val(ui.value);
			$("#val" + nb).text( ui.value);
		    }
		});
		$("#val" + i).text($("#option" + i).val() );
	    }
	});	

    }


})
