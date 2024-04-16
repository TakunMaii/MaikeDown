const codeParse = (segment)=>{
    segment = segment.replace(/\b(var|function|const|int|char|bool|double|float|void|if|else|while|for|break|continue|new|delete|using|try|true|false)\b/gm, function(match) {
        return '<codekey>' + match + '</codekey>';
    });
    segment = segment.replace(/\b(\d+(\.\d+)?)\b/gm, function(match) {
        return '<codenumber>' + match + '</codenumber>';
    });
    segment = segment.replace(/(\(|\)|\{|\}|\[|\])/gm, function(match) {
        return '<codebracket>' + match + '</codebracket>';
    });
    segment = segment.replace(/\n/g,"<br>");
    segment = segment.replace(/ /g, '&nbsp;');
    return segment;
}

const inlineParse = (segment)=>{
    console.log(segment);
    //bold and italic
    segment = segment.replace(/\*\*\*(.*?)\*\*\*/gm, "<b><i>$1</i></b>");
    //bold
    segment = segment.replace(/\*\*(.*?)\*\*/gm, "<b>$1</b>");
    //italic
    segment = segment.replace(/\*(.*?)\*/gm, "<i>$1</i>");
    //in line code
    segment = segment.replace(/`(.*?)`/gm, function(match){
        match = codeParse(match);
        match = match.substring(1,match.length-1);
        return "<inlinecode>"+match+"</inlinecode>";
    });
    
    return segment;
}

const parseSegment = (segment)=>{
    if(!segment)return "";
    // console.log("parse segment: "+segment);
    if(segment[0]=='#')
    {//title
        var index = segment.indexOf('\n');
        if(index>0)
        {
            var thisseg = segment.substring(0,index);
            var restseg = index+1 < segment.length ? segment.substring(index+1) : null;
            var num = 0;
            while(thisseg[num]=='#')num++;
            var html0 = "<h"+num+">"+thisseg.slice(num)+"</h"+num+">";
            var html1 = parseSegment(restseg);
            return html0+html1;
        }
        else
        {
            var num = 0;
            while(segment[num]=='#')num++;
            var html = "<h"+num+">"+segment.slice(num)+"</h"+num+">";
            return html;
        }
    }
    else if(segment[0]=='>')
    {// reference
        return "<reference>"+inlineParse(segment.substring(1))+"</reference>";
    }
    else if(segment[0]=='-')
    {// unordered list
        var lines = segment.split('\n');
        var html = "<ul>";
        var num = 0;
        while(lines[num][0]=='-')
        {
            html += '<li>'+inlineParse(lines[num].substring(1))+"</li>";
            num++;
            if(num==lines.length)break;
        }
        html += "</ul>";
        var rest = "";
        for(;num<lines.length;num++)
        {
            rest += lines[num];
        }
        return html + parseSegment(rest);
    }
    else if(segment[0]=='+')
    {// ordered list
        var lines = segment.split('\n');
        var html = "<ol>";
        var num = 0;
        while(lines[num][0]=='+')
        {
            html += '<li>'+inlineParse(lines[num].substring(1))+"</li>";
            num++;
            if(num==lines.length)break;
        }
        html += "</ol>";
        var rest = "";
        for(;num<lines.length;num++)
        {
            rest += lines[num];
        }
        return html + parseSegment(rest);
    }
    else if(segment[0]=='`'&&segment[1]=='`'&&segment[2]=='`')
    {
        const parts = segment.split("```");
        var html = "";
        //use 1,3,5...
        for(var i = 0;i<parts.length;i++)
        {
            if(i%2==0)
            {
                html += parts[i];
                continue;
            }
            html += "<codecube>"+codeParse(parts[i])+"</codecube>";
        }
        return html;
    }
    else
    {//normal text
        return "<div>"+inlineParse(segment)+"</div>";
    }
    
}

const maike=(content)=>{
    var result = "";
    const segments = content.split(/\n\s*\n/);
    segments.forEach(segment => {
        result += parseSegment(segment);
    });
    return "<div>"+result+"</div>";
}
