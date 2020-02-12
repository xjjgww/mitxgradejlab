function transform()
{
    var inputtext = document.getElementById("input-text").value;
    var parser = new DOMParser();
    var xhtml = parser.parseFromString(inputtext, 'text/html');

    // input
    var student_table = xhtml.getElementsByClassName('student-table')[0];
    var student_tbody = student_table.getElementsByTagName('tbody')[0];
    var student_list = student_tbody.getElementsByTagName('tr');
    var grade_table = xhtml.getElementsByClassName('grade-table')[0];
    var grade_experiments = ((grade_table.getElementsByTagName('thead')[0]).getElementsByTagName('tr')[0]).getElementsByTagName('th');
    var grade_value_lines = (grade_table.getElementsByTagName('tbody')[0]).getElementsByTagName('tr');
    var grade_value_example = grade_value_lines[0].getElementsByTagName('td');

    // output
    var grade_title = document.getElementById("grade-title");
    var grade_col = grade_title.getElementsByTagName("th");
    var exp_property = [];
    for(var j=0; j<grade_experiments.length; j++)
    {
        var td_title = grade_value_example[j].title;
        var expabbr = ((grade_experiments[j].getElementsByTagName('div'))[0]).innerHTML;

        if(expabbr == "Total") { continue; }

        var expparse = expabbr.split(" ");
        if(expparse.length == 1) { exp_property[j] = -1; }
        else if(expparse[1] == "Avg") { exp_property[j] = 0; }
        else
        {
            var point = td_title.match(/.+\(\d+\/(\d+)\)/)[1];
            exp_property[j] = Number(point);
            expabbr = expabbr + " (" + point + "pt)";
        }
        var th;
        if(j < grade_col.length)
	{
	    th = grade_col[j];
        }
	else
        {
	    th = document.createElement("th");
            grade_title.appendChild(th);
        }
        th.innerHTML = expabbr;
    }

    var name_tbody = document.getElementById("name-tbody");
    var lines = name_tbody.getElementsByTagName("tr");
    var grade_tbody = document.getElementById("grade-tbody");
    var grade_lines = grade_tbody.getElementsByTagName("tr");
    for(var i=0; i<student_list.length; i++)
    {
        // document.getElementById("outputtext").innerHTML = inputtext;
        var tr, td_0, td_1, tr_grade;
        if(i < lines.length)
        {
            tr = lines[i];
            td_0 = tr.getElementsByTagName("td")[0];
            td_1 = tr.getElementsByTagName("td")[1];
            tr_grade = grade_lines[i];
        }
        else
        {
            tr = document.createElement("tr");
            name_tbody.appendChild(tr);
            td_0 = document.createElement("td");
            tr.appendChild(td_0);
            td_1 = document.createElement("td");
            tr.appendChild(td_1);
            tr_grade = document.createElement("tr");
            grade_tbody.appendChild(tr_grade);
        }
        if(i%2==1) { tr.style.backgroundColor = "#eeeeee"; }
        var kerberos = ((student_list[i].getElementsByTagName('td'))[0].getElementsByTagName('a'))[0].text;
        td_0.innerHTML = kerberos;
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                td_1.innerHTML = this.responseText;
            }
        }
        xmlhttp.open("GET", "getname.php?q="+kerberos, true);
        xmlhttp.send();

        if(i%2==1) { grade_lines[i].style.backgroundColor = "#eeeeee"; }
        var grade_value = grade_value_lines[i].getElementsByTagName('td');
        var grade_td = grade_lines[i].getElementsByTagName("td");
        var nom = 0;
        var den = 0;
        for(var j=0; j<exp_property.length; j++)
        {
            var td;
            if(j < grade_td.length)
            {
                td = grade_td[j];
            }
            else
            {
                td = document.createElement('td');
                grade_lines[i].appendChild(td);
            }
            td.innerHTML = grade_value[j].innerHTML;

            if(exp_property[j] == -1)
            {
                td.innerHTML = Number(grade_value[j].innerHTML).toFixed(1);
                td.style.color = "red";
            }
            else if(exp_property[j] > 0)
            {
                point = exp_property[j];
                nom = nom + Number(grade_value[j].innerHTML) * point;
                den = den + point;
                td.style.color = "#206EB6";
            }
            else if(exp_property[j] == 0)
            {
                td.innerHTML = (nom/den).toFixed(1);
                nom = 0;
                den = 0;
                td.style.color = "red";
            }
            if(grade_value[j].className == "grade_None") td.style.color = "#cccccc";
        }
        
    }
    var newheight = 28*(lines.length+2)+"pt";
    (document.getElementById("grade-region")).style.height = newheight;

}
