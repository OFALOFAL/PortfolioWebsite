const skillsImgPath = document.getElementById('skillsImgPath').text + '/';

const gpt_skill_levels_list = [
    "👶 Beginner", //0
    "📚 Learner", //1
    "📏 Amateur", //2
    "📐 Apprentice", //3
    "🎓 Intermediate", //4
    "⚙️ Competent", //5
    "🔥 Skilled", //6
    "👨‍💻 Proficient", //7
    "👷️ Expert", //8
    "👨‍🔬 Master" //9
];

let open_div = 0;

let tech_stack = [
    {
        'name': 'Education',
        'iconImg': 'education',
        'skill': '',
        'more': true,
        'content_more': [
            ['ICON', 'zsel1'],
            ['TEXT', 'Zespół Szkół Elektrycznych w Krakowie: '],
            ['TEXT', (Math.min(5, new Date().getFullYear() - 2021)).toString() + ' years of education']
        ]
    },
    {
        'name': 'Python',
        'iconImg': 'python',
        'skill': gpt_skill_levels_list[6],
        'more': true,
        'content_more': [
            ['TEXT', 'My go-to programming language.<br>' +
            'Its simplicity, readability, and extensive libraries have made it my trusted companion for tackling a wide array of projects.<br>' +
            'With Python, I effortlessly bring my ideas to life, whether it\'s for artificial intelligence, simple scripts or even web development.'],
            ['IMG', 'Python-Masterclass'],
        ],
    },
    {
        'name': 'TensorFlow',
        'iconImg': 'TensorFlow',
        'skill': gpt_skill_levels_list[4],
        'more': true,
        'content_more': [
            ['TEXT', 'TensorFlow stands out as my preferred tool for machine learning due to its versatility and robustness.<br>' +
            'TensorFlow\'s efficient computational graph system excels with complex tasks, ' +
            'and its strong community and hardware compatibility ensure reliable data-to-insight transformations.'],
            ['IMG', 'TF-zeroToMastery']
        ]
    },
    {
        'name': 'C++',
        'iconImg': 'c++',
        'skill': gpt_skill_levels_list[6],
        'more': true,
        'content_more': [
            ['TEXT', 'C++ holds a special place for me as my first programming language.<br>' +
            'Its power and versatility have kept me using it throughout my journey.' +
            'With C++, I can tackle diverse challenges, and its strong performance and cross-platform capabilities ensure my projects run smoothly.'],
            ['IMG', 'C++-FromBegginerToBeyond']
        ]
    },
    {
        'name': 'R',
        'iconImg': 'R',
        'skill': gpt_skill_levels_list[4],
        'more': true,
        'content_more': [
            ['TEXT', 'I use R for its exceptional statistical analysis capabilities, making it sometimes my choice for data exploration and visualization.'],
            ['IMG', 'R-Bootcamp']
        ]
    },
    {
        'name': 'mySQL',
        'iconImg': 'mySql',
        'skill': gpt_skill_levels_list[4],
        'more': false,
        'content_more': null
    },
    {
        'name': 'JS',
        'iconImg': 'JS',
        'skill': gpt_skill_levels_list[5],
        'more': false,
        'content_more': null
    },
    {
        'name': 'swift',
        'iconImg': 'swift',
        'skill': gpt_skill_levels_list[1],
        'more': false,
        'content_more': null
    },
    {
        'name': 'git',
        'iconImg': 'git',
        'skill': gpt_skill_levels_list[4],
        'more': false,
        'content_more': null
    },
];

let width = document.body['scrollWidth'];
setInterval(() => {
        const new_width = document.body['scrollWidth'];
        if (new_width != width){
            width=new_width;
            initSkills();
        }
    }, 1)

function initSkills() {
    if (width <= 1100) {
        let height = document.documentElement.clientHeight;
        document.getElementById('skills-content').innerHTML = `
            <div class='centerDiv' id='skillsDiv' style='
            top: 0%; 
            -ms-transform: translate(-50%, 0);
            transform: translate(-50%, 0);
            margin-top: 7ch;
    '></div>
        `;
    } else {
        document.getElementById('skills-content').innerHTML = `<div class='centerDiv' id='skillsDiv'></div>`
    }
    let skillsDiv = document.getElementById('skillsDiv');
    for (let i = 0; i < tech_stack.length; i++) {
        const element = tech_stack[i];

        const mainStyle = `background-color: #d0c4e3; margin-top: 1ch; font-family: 'Source Code Pro', monospace;`;

        let elementDiv = `<div class="skill container-sm p-2 rounded" id="skill_${i}" style="${mainStyle}">`

        elementDiv += "<div class='row'>"

        elementDiv += "<div class='col-sm-1' style='text-align: center'>"
            elementDiv += '<div>'
                elementDiv += `<img src='${skillsImgPath + element.iconImg}.jpg' style="padding-top: 2px; padding-bottom: 2px; max-height: 4ch; max-width: 4ch;">`;
            elementDiv += '</div>'
        elementDiv += "</div>";

        elementDiv += "<div class='col-sm-6'>";
            elementDiv += "<div class='skill-textDiv'>"
            elementDiv += `<a>
                <b style="font-size: 2.6ch">${element.name}</b>
            </a>`;
            elementDiv += "</div>"
        elementDiv += "</div>";

        elementDiv += "<div class='col-sm-4'>";
            elementDiv += "<div class='skill-textDiv'>"
            elementDiv += `<a style="font-size: 2.1ch">
                ${element.skill}
            </a>`;
            elementDiv += "</div>"
        elementDiv += "</div>";

        if (i !== open_div && element.more){
            elementDiv += "<div class='col-sm-1'>";
            elementDiv += "<div style='margin-top: 1.5ch; float: right; padding-right: 0.4ch'>"
            elementDiv += `<a style="font-size: 1.6ch;">🔼</a>`;
            elementDiv += "</div>"
            elementDiv += "</div>";
            elementDiv += "</div>";
        }

        if (i === open_div && element.more) {
            elementDiv += "<div class='col-sm-1'>";
            elementDiv += "<div style='margin-top: 1.5ch; float: right; padding-right: 0.4ch'>"
            elementDiv += `<a style="font-size: 1.6ch;">🔽</a>`;
            elementDiv += "</div>"
            elementDiv += "</div>";
            elementDiv += "</div>";

            const smallStyle = `background-color: rgb(255, 245, 227); border-color: #C5B4E3; border-style: none dotted dotted dotted;`;
            elementDiv += `<div class="skill" class='container-sm' style="${smallStyle}">`;
            elementDiv += "<div class='row'>"

            for (let k= 0; k<element.content_more.length; k++)
            {
                const content_element_item_type = element.content_more[k][0];
                const content_element_item = element.content_more[k][1];

                if (content_element_item_type === 'ICON'){
                    const icon_name = content_element_item;

                    elementDiv += "<div class='col-sm-1' style='text-align: center'>";
                        elementDiv += `<a title="Click to download" href="${skillsImgPath + content_element_item}.jpg" download>`;
                            elementDiv += `<img src='${skillsImgPath + icon_name}.jpg' style="padding-top: 2px; padding-bottom: 2px; max-height: 4ch; max-width: 4ch;">`;
                        elementDiv += `</a>`;
                    elementDiv += "</div>";
                }

                if (content_element_item_type === 'TEXT'){
                    const text = content_element_item;

                    if (content_element_item.length === 2)
                        elementDiv += "<div class='col-sm-6'>";
                    else
                        elementDiv += "<div class='col-sm'>";

                        elementDiv += "<div class='skill-textMoreDiv'>"
                        elementDiv += `<a>${text}</a>`;
                        elementDiv += "</div>";
                    elementDiv += "</div>";
                }

                if (content_element_item_type === 'IMG') {
                    const img_name = content_element_item;

                    if (content_element_item.length === 2)
                        elementDiv += "<div class='col-sm-6' style='text-align: center'>";
                    else
                        elementDiv += "<div class='col-sm' style='text-align: center'>";

                        elementDiv += `<a title="Click to download" href="${skillsImgPath + img_name}.jpg" download>`;
                            elementDiv += `<img src='${skillsImgPath + content_element_item}.jpg' style="max-width: 50%;">`;
                        elementDiv += `</a>`;
                    elementDiv += "</div>";
                }
            }

            elementDiv += "</div>"
            elementDiv += "</div>";
        }

        skillsDiv.innerHTML += elementDiv;

    }
    for (let i= 0; i < tech_stack.length; i++) {
    let elementDiv = document.getElementById(`skill_${i}`);
    if (tech_stack[i].more) {
        elementDiv.style.cursor = 'pointer';
        elementDiv.onclick = function () {
            if (open_div !== i)
                open_div = i;
            else
                open_div = -1;
            initSkills();
        };
    }
}
}

initSkills();

document.getElementById("openbtn").addEventListener("mouseenter", function(  ) {
    openSidebar();
});

function openSidebar() {
    document.getElementById("sidebar").style.width = "150px";
    document.getElementById("openbtn").style.padding = '0';
}

function closeSidebar() {
    document.getElementById("sidebar").style.width = "0";
    document.getElementById("openbtn").style.padding = '10px 15px';
}

document.getElementById("openbtn").addEventListener("click", openSidebar);
document.getElementById("closebtn").addEventListener("click", closeSidebar);
