import React, { useState } from "react";
import './Dashboard.css';

const Dashboard = () => {
  const [markdownText, setMarkdownText] = useState("");
  const [html, setHtml] = useState("");
  const [markdownTool, setMarkdownTool] = useState({
    bold: false
  })

  const [highlightTextIndexs, setHighlightTextIndexs] = useState([])

  const convertMarkdownToHtml = async () => {
    let text = markdownText
    highlightTextIndexs.reverse().map(item => {
    text = item.end ? text.slice(0,item.end) + "**" + text.slice(item.end) : text + "**"
    text = text.slice(0, item.start + 1) +  "**" + text.slice(item.start+1)
    })
    try {
      const response = await fetch(
        "http://localhost:3001/api/convertTextToHtml",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({markdownText: text}),
        }
      );
      const responseData = await response.json();
      setHtml(responseData.html);
    } catch (error) {
      console.error("Error converting Markdown to HTML", error);
    }
  };

  const submitFn = () => {
    convertMarkdownToHtml();
  }

  const boldFn = () => {
    setMarkdownTool({...markdownTool, bold: !markdownTool.bold})
    if(markdownTool.bold){
        let hightlightTextArr = highlightTextIndexs[highlightTextIndexs.length - 1]
        console.log(hightlightTextArr,"last element")
       setHighlightTextIndexs(highlightTextIndexs.map(item => {
        if(item.id === hightlightTextArr.id){
            return {...item, end: markdownText.length}
        }
        return item
       }))

    }else{
       setHighlightTextIndexs([...highlightTextIndexs, {id: highlightTextIndexs.length, start: markdownText.length - 1 }])
    }
  }

  return (
    <div className="dashboard-container">
      <div className="markeditor">
        <h1>Markdown Editor</h1>
        <div>
            <button className={markdownTool.bold ? "active-bold" : "inactive-bold"} onClick={boldFn}>Highlight Text</button>
        </div>
        <textarea
          rows={7}
          cols={40}
          value={markdownText}
          onChange={(e) => setMarkdownText(e.target.value)}
          placeholder="Type your Markdown here..."
        />
        <button className="btn" onClick={submitFn}>Submit</button>
      </div>
      <div className="preview">
        <h1>Live Preview</h1>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
};

export default Dashboard;
