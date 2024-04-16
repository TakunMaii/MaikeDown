const inlineParse = (segment)=>{
    console.log(segment);
    //bold and italic
    segment = segment.replace(/\*\*\*(.*?)\*\*\*/gm, "<b><i>$1</i></b>");
    //bold
    segment = segment.replace(/\*\*(.*?)\*\*/gm, "<b>$1</b>");
    //italic
    segment = segment.replace(/\*(.*?)\*/gm, "<i>$1</i>");
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
        return "<reference>"+segment.substring(1)+"</reference>";
    }
    else if(segment[0]=='-')
    {// unordered list
        var lines = segment.split('\n');
        var html = "<ul>";
        var num = 0;
        while(lines[num][0]=='-')
        {
            html += '<li>'+lines[num].substring(1)+"</li>";
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
            html += '<li>'+lines[num].substring(1)+"</li>";
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