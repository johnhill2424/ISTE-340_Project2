
	//now what?
	//api:  http://www.ist.rit.edu/api/
	function doc(id){
      return document.getElementById(id);
   }

   var images = [];

	$(document).ready(function(){
		//get the about data...
		$.ajax({
			type:'get',
			url:'proxy.php',
			data:{path:'/about/'},
			dataType:'json'
		}).done(function(json){
			//console.log(json);
			//console.log(json.description);
			//console.log(json.quote);
		});

		/* ABOUT SECTION */

		createSection('about');

		xhr('get',{path:'/about/'},'#about').done(function(json){
			var x='';
			var counter = 0;

			var divContainer = $('<div></div').attr({'id': 'about'});

			$('#about').append('<h1 class="about">INFORMATION SCIENCES & TECHNOLOGIES @ RIT</h1>').append($(divContainer));
			
			$.each(json,function(){
				if (counter == 0){
					x+='<h2 class="about"> "'+this+'" </h2>';
				}
				else{
					x+='<p class="about"> "'+this+'" </p>';
				}
				counter = counter + 1;
			});
			$(divContainer).append(x);
			$('#about').append($(divContainer));

		});

		/*  END OF ABOUT SECTION */



		/*  UNDERGRADUATE SECTION */
		createSection('undergraduate');		
		
		xhr('get',{path:'/degrees/undergraduate/'},'#undergraduate').done(function(json){
			//put out the faculty..
			var x='';
			var counter = 0; 
			var divRow;

			var divContainer = $('<div></div');
			$(divContainer).attr({id:'undergraduateTable'});

			$('#undergraduate').append('<h1 class="undergrad">Our Undergraduate Degrees</h1>').append($(divContainer));

			$.each(json.undergraduate,function(key, value){

				if (counter == 0){
					divRow = $('<div></div>');
					$(divRow).attr({class:'row'}).appendTo(divContainer);
				}
				$(divRow).append('<div class="undergrad col-sm" data-uName="'+this.degreeName+'"><h2>'+this.title+'</h2><h4>'+this.description+'</h4></div>');
				counter = counter + 1;

			});

			$('#undergraduate').append($(divContainer));
			
			//Good place to refence json and have it still exist, called a closure
			$('.undergrad').on('click',function(){

				var me=getAttributesByName(json.undergraduate,'degreeName',$(this).attr('data-uName'));
				
            //console.log(me);
            var x = '';
            var y = '';
            x=me.title;
            $.each(me.concentrations, function(key, value){
               y+='<li>'+this+'</li>';
            });
            console.log(this);
            $(this).attr({"data-featherlight": '<h2>'+x+'</h2><h4>Concentrations: </h4><ul>'+y+'</ul>'});
			});

		});
		/*  END OF UNDERGRADUATE SECTION */


		/*  GRADUATE SECTION */
		createSection('graduate');		
		
		xhr('get',{path:'/degrees/graduate/'},'#graduate').done(function(json){
			//put out the faculty..
			var counter = 0; 
			var divRow;

			var x ='';

			var divContainer = $('<div></div');
			$(divContainer).attr({id:'graduateTable'});
			
			var gradCertSect = $('<div></div');
			$(gradCertSect).attr({id:'gradCert'});

			$('#graduate').append('<h1 class="grad">Our Graduate Degrees</h1>').append($(divContainer));

			$.each(json.graduate,function(){

				if (this.degreeName == "graduate advanced certificates"){
               x+='<p class="gradCert"><h2 class="gradCert">'+this.degreeName+'</h2><h4 class="gradCert">'+this.availableCertificates[0]+'</h4><h4 class="gradCert">'+this.availableCertificates[1]+'</h4></p>'
            }

				else{
					if (counter == 0){
						divRow = $('<div></div>');
						$(divRow).attr({class:'row'}).appendTo(divContainer);
					}

					$(divRow).append('<div class="grad col-sm" data-uName="'+this.degreeName+'"><h2>'+this.title+'</h2><h4>'+this.description+'</h4></div>');
					counter = counter + 1;
				}

			});

			$('graduate').append($(divContainer));
			$(gradCertSect).append(x);
			$(divContainer).append(gradCertSect);
			
			//closure
			$('.grad').on('click',function(){

				var me=getAttributesByName(json.graduate,'degreeName',$(this).attr('data-uName'));
				console.log(me);
				
				if (me.degreeName != 'graduate advance certificates'){
					var x = '';
					var y = '';
					x=me.title;
					$.each(me.concentrations, function(key, value){
						y+='<li>'+this+'</li>';
					});
					console.log(this);
					$(this).attr({"data-featherlight": '<h2>'+x+'</h2><ul>'+y+'</ul>'});
				}
			});
		});
		/*  END OF GRADUATE SECTION */


		/*  MINORS SECTION */

		createSection('minors');		

		xhr('get',{path:'/minors/'},'#minors').done(function(json){

			var divContainer = $('<div></div');
			$(divContainer).attr({id:'minorTable'}).appendTo(minors);

			$('#minors').append('<h1 class="minors">Our Undergraduate Minors</h1>').append($(divContainer));

			var counter = 0; 
			var divRow;

			var x='';
			$.each(json.UgMinors,function(){
				x+='<div class="minors"><h2>'+this.name+'</h2></div>'

				//since we want 4 elements per row, once the counter hits 4 we will start a new row
				if(counter == 4){
					counter = 0;
				}
				if (counter == 0){
					divRow = $('<div></div>');
					$(divRow).attr({class:'row'}).appendTo(divContainer);
				}
				$(divRow).append('<div class="col-sm minors" data-uName="'+this.name+'"><h2>'+this.title+'</h2></div>');
				counter = counter + 1;
			});

			$('.minors').on('click',function(){

				var me=getAttributesByName(json.UgMinors,'name',$(this).attr('data-uName'));
				var x = '';
				var y = '';
				x=me.title;

				var description = me.description;
				var start = description.search("Faculty Minor Liaison");
				
				//this is from "Faculty Minor Liasion" to the end of the string
				var slicedString = description.slice(start);

				//finds the index of the first period
				var firstPeriod = slicedString.indexOf(".");
				
				var facultyMinorLiaison = slicedString.slice(slicedString, firstPeriod);
				//console.log(facultyMinorLiaison);

				var minorAdvisor_ = slicedString.slice(firstPeriod);

				//get rid of period and whitespace before the start of the string
				var minorAdvisor = (minorAdvisor_.replace(".","").trim());

				//go through the courses array
				$.each(me.courses, function(key, value){
					y+='<li>'+this+'</li>';
				});
				//console.log(this);
				$(this).attr({"data-featherlight": '<h1>'+x+'</h1><p>'+me.description+'<p><h3>'+facultyMinorLiaison+'</h3><h3>'+minorAdvisor+'</h3><ul>'+y+'</ul><p>'+'*'+me.note+'</p>'});
			});

		});
		/*  END OF MINORS SECTION */


		/*  EMPLOYMENT SECTION */
		createSection('employment');		
		var content_Employment = '';
		var content_Coop = '';
		var title = '';
		
		xhr('get',{path:'/employment/introduction'},'#employment').done(function(json){
			var x='';

			$.each(json,function(key, value){
				title = value.title;

				var content = value.content;
				
				$.each(content,function(){
					if (this.title == "Employment"){
						content_Employment = this;
					}
					if (this.title == "Cooperative Education"){
						content_Coop = this;
					}
				});
				
			});
			$('#employment').append('<h1 id="mainTitle">'+title+'</h1><h2>'+content_Employment.title+'</h2><p>'+content_Employment.description+'</p>');
		});
				

		var title = '';
		xhr('get',{path:'/employment/degreeStatistics'},'#employment').done(function(json){
			var x='';

			var divContainer = $('<div></div');
			$(divContainer).attr({id:'statsTable'}).appendTo(employment);

			var counter = 0;
			var divRow;
			divRow = $('<div></div>');
			$(divRow).attr({class:'row'}).appendTo(divContainer);
			

			$.each(json,function(key, value){
				title = value.title;

				var stats = value.statistics;
			
				$.each(stats,function(key, value){
					$(divRow).append('<div class="col-sm"><h2>'+value.value+'</h2><h4>'+value.description+'</h4></div>');
				});
				
			});
			
			$(divContainer).append('<h2>'+content_Coop.title+'</h2><p>'+content_Coop.description+'</p>');
			$('#employment').append(divContainer);
		});

	
		var title = '';
		xhr('get',{path:'/employment/employers'},'#employment').done(function(json){
			var x='';

			var divContainer = $('<div></div');
			$(divContainer).attr({id:'employersTable'}).appendTo(employment);

			title = json.employers.title;

			var divRow;
			divRow = $('<div></div>');
			$(divRow).attr({class:'row'}).appendTo(divContainer);

			$.each(json.employers.employerNames,function(key, value){
				$(divRow).append('<div class="col-sm"><h2>'+this+'</h2></div>');
			});
			$('#employment').append('<h2 id = "empH2">'+title+'</h2>');
			$('#employment').append(divContainer);
		});
		
		var title = '';
		xhr('get',{path:'/employment/careers'},'#employment').done(function(json){
			var x='';

			var divContainer = $('<div></div');
			$(divContainer).attr({id:'careersTable'}).appendTo(employment);

			title = json.careers.title;

			var divRow;
			divRow = $('<div></div>');
			$(divRow).attr({class:'row'}).appendTo(divContainer);

			$.each(json.careers.careerNames,function(key, value){
				$(divRow).append('<div class="col-sm"><h2>'+this+'</h2></div>');
			});
			$('#employment').append('<h2 id = "careerH2">'+title+'</h2>');
			$('#employment').append(divContainer);
		});
		/*  END OF EMPLOYMENT SECTION */



		/*  MAP SECTION */
      createSection('map');	

		var divContainer = $('<div id="mapDiv">');

		var h1 = $('<h1>Where our Students Work</h1>');

		var iframeMap = $('<iframe></iframe');
		$(iframeMap).attr({src: 'http://ist.rit.edu/api/map/', scrolling: 'no', frameborder: "0",id:'map', height: '600', width: '1000'});

		$(h1).appendTo(divContainer);
		$(iframeMap).appendTo(divContainer);
		
		$('#map').append(divContainer);


		xhr('get',{path:'/employment/coopTable'},'#map').done(function(json){
			var x='';

			var divContainer = $('<div id = "coopTable">');
			var h2 = $('<h3>Employment and Co-op History Of Our Students</h3>');

			$(h2).appendTo(divContainer);
			title = json.coopTable.title;

			var coop = $('<div>');
			$(coop).attr({class:'coopHeader'});
			coop.text(title);

			$(divContainer).append(coop);
		
			var coopTable = '<table id="coopDataTable" class="display compact"><thead><tr>';

			
			//populate the th's with the header values
			$.each(json.coopTable.coopInformation[0],function(key, value){
				coopTable+='<th>'+key+'</th>';
			});

			coopTable+='</tr></thead><tbody>';
			
			$.each(json.coopTable.coopInformation,function(key, value){
				coopTable+='<tr><td>'+this.employer+'</td>';
				coopTable+='<td>'+this.degree+'</td>';
				coopTable+='<td>'+this.city+'</td>';
				coopTable+='<td>'+this.term+'</td></tr>';
			});

			coopTable+='</tbody></table>';

			var coopTable = $(coopTable);

			$(divContainer).append(coopTable);

			$('#map').append(divContainer);

			$('#coopDataTable').DataTable();		

		});

		/*  END OF MAP SECTION */


		/*  EMPLOYMENT SECTION */

		xhr('get',{path:'/employment/employmentTable'},'#map').done(function(json){
			var x='';

			var divContainer = $('<div>');

			title = json.employmentTable.title;

			var coop = $('<div >');
			$(coop).attr({class:'coopHeader'});
			coop.text(title);


			$(divContainer).append(coop);
			

			//create table and table elements
			var coopTable = $('<table>');
			$(coopTable).attr({id: 'empTable', class:'display compact'});
			var thead = $('<thead>');
			var tr = $('<tr>');
			
			
			//populate the th's with the header values
			$.each(json.employmentTable.professionalEmploymentInformation[0],function(key, value){
				var th = $('<th>');
				$(thead).append($(tr).append(th.text(key)));
			});

			$(coopTable).append(thead);
			
			var tbody = $('<tbody>');
			var tr = $('<tr>');
			
			$.each(json.employmentTable.professionalEmploymentInformation,function(key, value){
				var tr = $('<tr>');
				var td = $('<td>');
				$(tbody).append($(tr).append(td.text(this.employer)));
				var td = $('<td>');
				$(tbody).append($(tr).append(td.text(this.degree)));
				var td = $('<td>');
				$(tbody).append($(tr).append(td.text(this.city)));
				var td = $('<td>');
				$(tbody).append($(tr).append(td.text(this.title)));		
				var td = $('<td>');
				$(tbody).append($(tr).append(td.text(this.startDate)));	
			});
				
			$(coopTable).append(tbody);

			$(divContainer).append(coopTable);

			$('#map').append(divContainer);

			$('#empTable').DataTable();
		});
		
		/*  END OF EMPLOYMENT SECTION */


		/*  PEOPLE SECTION */

		createSection('people');	

		//get people
		//using our new cool XHR method...
		xhr('get',{path:'/people/'},'#people').done(function(json){
			
         //title 
         var title=(json.title);

         //put out the faculty..
			var x='';

         //JS way
         //var divContainer = document.createElement('div');
         //divContainer.setAttribute('id','facultyTable')
         //doc('people').appendChild(divContainer);

         var divContainer = $('<div></div');
			$(divContainer).attr({id:'facultyTable'}).appendTo(people);
			
			var h1 = $('<h1 id="peopleHeader">Our People</h1>');
			$(divContainer).append(h1);

			var h2 = $('<h2 id="facH2">Our Faculty</h2>');
			$(divContainer).append(h2);

         var counter = 0;
         var divRow;

			$.each(json.faculty,function(){
            //console.log('here');
				//data-uName is the unique identifier for which person I'm interested in...
            images.push(this.imagePath);
            //console.log(counter);
            if(counter == 3){
               counter = 0;
            }
            if (counter == 0){
               divRow = $('<div></div>');
               $(divRow).attr({class:'row'}).appendTo(divContainer);
            }

				a = $('<a></a>')
            $(a).attr({href:'#','data-uName':this.username,class:'col-md-4'});

            $(a).append('<div class="facPerson" data-uName="'+this.username+'"><h3>'+this.name+'</h3><h4>'+this.title+'</h4></div>');
            $(divRow).append(a);
				counter = counter + 1;
				
			});

			$('.facPerson').on('click',function(){
				var me=getAttributesByName(json.faculty,'username',$(this).attr('data-uName'));
				console.log(me);

				$(this).attr({"data-featherlight": '<div><h2>'+me.name+','+me.title+'</h2><hr><img src='+me.imagePath+'><p><i class="far fa-building fa-2x"></i>'+me.office+'</p><p><i class="fas fa-phone fa-2x"></i>'+me.phone+'</p><p><i class="fas fa-envelope fa-2x"></i>'+me.email+'</p></div>'});

			});

			$('#people').append(divContainer);
			
			var y='';

			var h2 = $('<h2 id="staffH2">Our Staff</h2>');
			$(divContainer).append(h2);

         var divContainer = $('<div></div');
         $(divContainer).attr({id:'staffTable'}).appendTo(people);

         var counter = 0;
         var divRow;


			$.each(json.staff,function(){

            //console.log('here');
				//data-uName is the unique identifier for which person I'm interested in...
            images.push(this.imagePath);
            //console.log(counter);
            if(counter == 3){
               counter = 0;
            }
            if (counter == 0){
               divRow = $('<div></div>');
               $(divRow).attr({class:'row'}).appendTo(divContainer);
            }
				a = $('<a></a>')
            $(a).attr({href:'#','data-uName':this.username,class:'col-md-4'});

            $(a).append('<div class="staffPerson" data-uName="'+this.username+'"><h3>'+this.name+'</h3><h4>'+this.title+'</h4></div>');
            $(divRow).append(a);
				counter = counter + 1;
			});
			$('#people').append(x);
			$('.staffPerson').on('click',function(){
				var me=getAttributesByName(json.staff,'username',$(this).attr('data-uName'));
				//console.log(me);

            $(this).attr({"data-featherlight": '<div><h2>'+me.name+','+me.title+'</h2><hr><img src='+me.imagePath+'><p><i class="far fa-building fa-2x"></i>'+me.office+'</p><p><i class="fas fa-phone fa-2x"></i>'+me.phone+'</p><p><i class="fas fa-envelope fa-2x"></i>'+me.email+'</p></div>'});

			});
		});

		/*  END OF PEOPLE SECTION */


		/*  AREA RESEARCH SECTION */

      createSection('areaResearch');	
		createSection('facultyResearch');
      xhr('get',{path:'/research/'},'#areaResearch').done(function(json){

         var divContainer = $('<div></div');
         $(divContainer).attr({id:'InterestResearchTable'}).appendTo('#areaResearch');

			var h1 = $('<h1>Faculty Research: Areas of Interest</h1>');
			$(divContainer).append(h1);


         var counter = 0;
         var divRow;
         var a;
         $.each(json.byInterestArea,function(){

            if(counter == 3){
               counter = 0;
            }
            if (counter == 0){
               divRow = $('<div></div>');
               $(divRow).attr({class:'row'}).appendTo(divContainer);
            }
            a = $('<a></a>')
            $(a).attr({href:'#','data-uName':this.username,class:'col-md-4'});

            $(a).append('<div class="areaResearch" data-uName="'+this.areaName+'"><h2>'+this.areaName+'</h2></div>');
            $(divRow).append(a);
            counter = counter + 1;

         });
         $('#areaResearch').append(divContainer);
         $('.areaResearch').on('click',function(){
            var me=getAttributesByName(json.byInterestArea,'areaName',$(this).attr('data-uName'));
            //console.log(me);
            var x = '';
            var y = '';
            x=me.areaName;
            $.each(me.citations, function(){
               y+='<li>'+this+'</li>';
            });
            console.log(this);
            $(this).attr({"data-featherlight": '<h2>'+x+'</h2><ul>'+y+'</ul>'});

         });

			/*  END OF AREA REASEARCH SECTION */


			/*  FACULTY RESEARCH SECTION */

			var divContainer = $('<div></div');
			$(divContainer).attr({id:'facultyResearchTable'}).appendTo('#facultyResearch');

			var h1 = $('<h1>Faculty Research: Lookup by Faculty</h1>');
			$(divContainer).append(h1);

         var counter = 0;
         var divRow;
         var a;

         $.each(json.byFaculty,function(){

				//dont do this for deborah gears, her image didn't exist
				if (this.username == 'dgcics' || this.username == 'thoics'){
				}
				else{
					if(counter == 4){
						counter = 0;
					}
					if (counter == 0){
						divRow = $('<div></div>');
						$(divRow).attr({class:'row'}).appendTo(divContainer);
					}
					a = $('<a></a>')
					$(a).attr({href:'#','class': 'facTab, col-md-3','data-uName':this.username});

					$(a).append('<div class="facultyResearch" data-uName="'+this.username+'"><h2>'+this.facultyName+'</h2><img class = "facultyResearch" src="'+searchArray(images,this.username)+'"/></div>');
					$(divRow).append(a);
					counter = counter + 1;
				}

			});

				$('#facultyResearch').append(divContainer);


				$('.facultyResearch').on('click',function(){
					var me=getAttributesByName(json.byFaculty,'username',$(this).attr('data-uName'));
					//console.log(me);
					var x = '';
					var y = '';
					x=me.facultyName;
					$.each(me.citations, function(){
						y+='<li>'+this+'</li>';
					});
					console.log(this);
					$(this).attr({"data-featherlight": '<h2>'+x+'</h2><ul>'+y+'</ul>'});
				});
	   });
		/*  END OF FACULTY RESEARCH SECTION */


		/*  RESOURCES SECTION */
		
		createSection('resources');	
      xhr('get',{path:'/resources/'},'#resources').done(function(json){

         var divContainer = $('<div></div');
			$(divContainer).attr({id:'resourceSection'}).appendTo(people);
			
			var h1 = $('<h1>Resources</h1>');
			$(divContainer).append(h1);

         var counter = 0;
         var divRow;
         var a;
				
			var title = '';
			var subTitle = '';

         $.each(json,function(){
				
				if (json.title){
					title = json.title;
				}

				if (json.subTitle){
					subTitle = json.subTitle;
				}

            if(counter == 2){
               counter = 0;
            }
            if (counter == 0){
               divRow = $('<div></div>');
               $(divRow).attr({class:'row'}).appendTo(divContainer);
            }
            a = $('<a></a>')


				if (this.title == undefined){
					//filters out the title and subtitles parts 
					if (jQuery.type(this) === "string"){

					} 
					//forms section
					else{
						$(a).attr({href:'#','data-uName':this.title, class:'col-lg-6'});

						$(a).append('<div class="resources col-lg-6" data-uName="forms"><h2>Forms</h2></div>');
						$(divRow).append(a);
						counter = counter + 1;
					}

				}
				else{
					$(a).attr({href:'#','data-uName':this.title,class:'col-lg-6'});

					$(a).append('<div class="resources col-lg-6" data-uName="'+this.title+'"><h2>'+this.title+'</h2></div>');
					$(divRow).append(a);
					counter = counter + 1;
				}
         });
			

         $('#resources').append(divContainer);
         
			$('.resources').on('click',function(){
				if ($(this).attr('data-uName') == "forms"){
					var me = json.forms;
				}
				else{
					var me=getAttributesByName(json,'title',$(this).attr('data-uName'));
					console.log(me);
					var title =me.title;
				}

            var x = '';
            var y = '';
				
				//this part of code will eat anything, since the resources section doesn't really have a pattern
				$.each(me, function(key, value){
					if(jQuery.type(this) == "object" || jQuery.type(this) == "array"){
						$.each(this,function(key,value){
							if(jQuery.type(this) == "object" || jQuery.type(this) == "array"){
								$.each(this,function(key,value){
									if(jQuery.type(this) == "object" || jQuery.type(this) == "array"){
										$.each(this,function(key,value){
											x+='<div>'+value+'</div><br>';
										});
									}
									else{
										x+='<div>'+value+'</div><br>';
									}
								});
							}
							else{
								x+='<div>'+value+'</div><br>';
							}
						});
					}
					else{
						x+='<div>'+value+'</div><br>';
					}

				});

				if (me.graduateForms){
					$(this).attr({"data-featherlight": '<h2>Forms</h2><ul>'+x+'</ul>'});
				}
				else{
					$(this).attr({"data-featherlight": '<h2>'+title+'</h2><ul>'+x+'</ul>'});
				}
            

         });
		
		});

		/*  END OF RESOURCES SECTION */


		/*  SOCIAL SECTION */

		createSection('social');	
		xhr('get',{path:'/footer/social'},'#social').done(function(json){

			$.each(json,function(key,value){
				var title=(json.title);
				var x='';

				var divContainer = $('<div></div');
				$(divContainer).attr({id:'social'}).appendTo(social);
				var div = $('<div></div>')

				$(div).append('<div class="social"><h1>'+this.title+'</h1><h3>'+this.tweet+'<br>'+this.by+'</h3><p><a href = '+this.twitter+'>Twitter</a><br><a id="fb" href = '+this.facebook+'>Facebook</a></p></div>').appendTo(divContainer);

				$('social').append(divContainer);
			});
      });

		/*  END OF SOCIAL SECTION */


		/*  QUICKLINKS SECTION */

		createSection('quicklinks');	
		xhr('get',{path:'/footer/quickLinks'},'#quicklinks').done(function(json){
			
			var h1 = '<h1>';
			$(h1).text("Quick Links").appendTo(quicklinks);

			$.each(json.quickLinks,function(key,value){
				var title=(json.title);
				var x='';

				var divContainer = $('<div></div');
				$(divContainer).attr({id:'quicklinks'}).appendTo(quicklinks);
				var div = $('<div></div>')

				$(div).append('<div class="social"><a href = '+this.href+'><h3>'+this.title+'</h3></a><br></div>').appendTo(divContainer);

				$('social').append(divContainer);
			});
      });
	
		xhr('get',{path:'/news/'},'#quicklinks').done(function(json){
			var title=(json.title);
			var x='';

			var divContainer = $('<div></div');
			$(divContainer).attr({id:'news'}).appendTo(quicklinks);
			a = $('<a></a>')
			$(a).attr({href:'#','data-uName':this.title});

			$(a).append('<div class="news" data-uName="'+this.title+'"><h3>All News</h3></div>').appendTo(divContainer);

			$('.news').on('click',function(){
				$.each(json.older,function(){
					x+='<div class="news"><h2>'+this.title+'</h2><h3>'+this.date+'</h3><p>'+this.description+'</p></div>';
				});
				$(this).attr({"data-featherlight": '<div>'+x+'</div>'});
			});
			$('#quicklinks').append(divContainer);
			var formContainer = $('<div id="formContainer"></div');
			
			$('#quicklinks').append(formContainer);


			xhrHTML('get',{path:'/contactForm/'}).done(function(json){
				$('#formContainer').append(json);
			});

      });




		/*  END OF QUICK LINKS SECTION */


		/*  COPYRIGHT SECTION */

		createSection('copyright');	
		xhr('get',{path:'/footer/copyright'},'#copyright').done(function(json){
			
			$.each(json.copyright,function(key,value){

				var h1 = '<h1>';
				$(h1).append(json.copyright.title).appendTo(copyright);

				var divContainer = $('<div></div');
				$(divContainer).attr({id:'copyright'}).appendTo(copyright);
				var div = $('<div></div>')

				$(div).append('<div class="copyright">'+json.copyright.html+'</div>').appendTo(divContainer);

				$('copyright').append(divContainer);

				return false;

			});

      });

		/*  END OF COPYRIGHT SECTION */



	}); //end of document ready

	$(window).on('load', function() {
		$(function() {
			$.scrollify({
				section : ".sections",
				setHeights: false
			});
		});
  	});

	////////////////////////////////////////////////////////////////////////////////
	/// utilities...
	/// 	arguments:
	///				getPost - either get or post...
	///				d - {path:'/uri/'}
	///				id - #parent (optional)
	///						the id of the parent container that I want my spinner to go in


	/// 	usage: xhr('get',{path:'/about/'},"#parentId").done(function(json){//deal});

	function xhr(getPost,d,id){
		return $.ajax({
			type:getPost,
			dataType:'json',
			data:d,
			cache:false,
			async:true,
			url:'proxy.php',
			beforeSend:function(){
				//spinner...
				$(id).append('<img src="spinner2.gif" class="funkyClassName"/>');
			}
		}).always(function(){
			//kill the spinner
			$(id).find('img.funkyClassName').fadeOut(500,function(){
				$(this).remove();
			});
		}).fail(function(err){
			console.log(err);
		}); //note - no done...
	}

	function xhrHTML(getPost,d,id){
		return $.ajax({
			type:getPost,
			dataType: 'html',
			data:d,
			cache:false,
			async:true,
			url:'proxy.php',
			beforeSend:function(){
				//spinner...
				$(id).append('<img src="spinner2.gif" class="funkyClassName"/>');
			}
		}).always(function(){
			//kill the spinner
			$(id).find('img.funkyClassName').fadeOut(500,function(){
				$(this).remove();
			});
		}).fail(function(err){
			console.log(err);
		}); //note - no done...
	}

	// getAttributesByName()
	// go through an array of objects and find the one that matches
	// name=val and return the specific object
	// 		arr - array to search through
	//			name - attribute name I want to match
	//			val - the value to equal the attribute name

	//			usage: getAttributesByName(json.faculty,'username', this one username);

	//looking for a match of username = data-uName

	function getAttributesByName(arr, name, val){
		var result = null;
		//does this row hold name:val
		//		specifically username:dsbics
		$.each(arr, function(){
			if(this[name]===val){
				result=this;
			}
		});
		return result;
	}

   function searchArray(arr, name){
		var result = null;
		$.each(arr, function(){
			if(this.includes(name)){
				result=this;
			}
		});
		return result;
	}
	
	// createSection()
	// Create a section and assign an id to it
	// 		id - the id to be assigned to the section

	//			usage: createSection('degrees');


	function createSection(id){
		var section = $('<section>');
		$(section).attr({'id':id}).appendTo($(container));

		//if odd section, set the background image to the computer desk
		var secIndex = $(section).index();

		//if odd section, give it the class of oddSect
		if ((secIndex % 2) === 0){
			$(section).attr({'class': 'oddSect sections'});
		}
		else if ((secIndex % 2) === 1){
			$(section).attr({'class': 'evenSect sections'});
		}

		$(section).appendTo($(container));


	}

