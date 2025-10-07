const windows = ["welcoming", "codeSearch", "allLaws", "law"]

let windowDiv = document.getElementById("windowDiv");

let currentWindow = windows[0];

function insertHTMLToWindow(htmlString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    
    Array.from(doc.body.childNodes).forEach(node => {
        windowDiv.appendChild(document.importNode(node, true));
    });
}

function loadWindow(name, parameters = [] ) { // for laws: parameter index 0 is the code for the law
    if (windows.find(window => window == name) != null) {
        let html = "";
        

        switch (name) {
            case windows[0]: // welcoming page
                html = `
                <div>
                    <h1>Welcome to the Novasoil Law Database</h1>
                    <button onclick="loadWindow(windows[2]);">All Laws</button>
                    <br>
                    <button onclick="loadWindow(windows[1]);">Search by Code</button>
                </div>
                `;

                break;
            case windows[1]: // code search page
                html = `
                <div>
                    <h1>Search Law by Code</h1>
                    <form action method="post" onsubmit="loadWindow(windows[3], [document.getElementById('code').value]); return false;">
                        <label for="code">Enter Law Code:</label>
                        <input type="text" id="code" name="code" placeholder="law id" required>
                        <input type="submit" value="Go">
                    <form>
                    <br>

                    <button onclick="loadWindow(windows[0]);">Home</button>
                </div>
                `;

                break;
            case windows[2]:
            html = `
            <div>
                <h1>All Laws</h1>
                <table border="1" cellpadding="5" cellspacing="0">
                <thead>
                    <tr>
                    <th>Code</th>
                    <th>Title</th>
                    <th>View</th>
                    </tr>
                </thead>
                <tbody id="allLawsBody"></tbody>
                </table>

                <button onclick="loadWindow(windows[0]);">Home</button>
            </div>
            `;
                break;
            case windows[3]: // law page
                
                const lawCode = parameters[0];

                const law = lawsDatabase[lawCode];
                const lawTitle = law.title;
                const lawContent = law.content;



                html = `
                <div>
                    <h1>${lawTitle}</h1>
                    <h2>Code: ${lawCode}</h2>
                    <pre>${lawContent}</pre>

                    <button onclick="loadWindow(windows[2]);">Back to All Laws</button>
                    <br>
                    <button onclick="loadWindow(windows[0]);">Home</button>
                </div>
                `;
                break;
            default:
                html = "";
                break;
        }

        if (html != "") {
            windowDiv.replaceChildren();
            insertHTMLToWindow(html);

            if (name == windows[2]) {
                const tbody = document.getElementById("allLawsBody");
                for (const [code, law] of Object.entries(lawsDatabase)) {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                    <td>${code}</td>
                    <td>${law.title}</td>
                    <td><button onclick="loadWindow(windows[3], ['${code}'])">View</button></td>
                    `;
                    tbody.appendChild(row);
                }
                
                
                
            }
        }
        
    }
}

document.addEventListener("DOMContentLoaded", function() {
    loadWindow(windows[0]);
});