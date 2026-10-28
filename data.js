/* group members */
const MEMBERS = [
  { img: "assets/member-1.png", name: "Steve Nash Sampaga", roles: ["Project Leader", "Frontend/Backend Programmer", "Web Designer", "Graphic Designer"], work: "Led the project's development, coordinated its overall design and functionality, and worked on the website's interactive features and visual presentation." },
  { img: "assets/member-2.png", name: "Steven James B. Silvosa", roles: ["Backend Programmer", "Video/Audio Editor", "Literary Researcher "], work: "Contributed to the project's technical development, researched the literary and historical context of Dekada '70, and assisted with preparing multimedia materials for the demonstration." },
  { img: "assets/member-3.png", name: "Kenneth S. Orencia", roles: ["Presenter/Narrator", "Writer ", "Documentation Officer"], work: "Contributed to the project's written documentation and presentation materials, helped organize the narrative report, and prepared to explain the project's literary analysis and connection to misinformation." }
];

/* source register (APA 7th edition), including works consulted for the project report. Use _text_ for italics. Only sources actually used by the site appear here. */
const SOURCES = [
  { id: "S1", group: "Literary text", apa: "Bautista, L. (2018). _Dekada '70_. Anvil Publishing.", url: "https://www.ortigasfoundationlibrary.com.ph/collections/library-holdings/dekada-70", use: "The novel analysed in the literary track (catalogue record, ISBN 978-971-27-3398-7). First published in Filipino in 1983." },
  { id: "S2", group: "Literary text", apa: "Interaksyon. (2022, January 28). _‘Dekada ’70’ Penguin edition? Lualhati Bautista gets offer to have novel published_. Philstar.com.", url: "https://interaksyon.philstar.com/hobbies-interests/2022/01/28/209433/lualhati-bautista-receives-offer-dekada-70-penguin/", use: "Press coverage of a publishing offer for the novel, noting its English translation and that the author was self-publishing it. Background reading." },
  { id: "S3", group: "Primary documents", apa: "Republic of the Philippines. (1972). _Proclamation No. 1081, s. 1972: Proclaiming a state of martial law in the Philippines_. Batas Natin (batasnatin.com).", url: "https://batasnatin.com/laws/proc-1081-5", use: "What the proclamation declared and the grounds it gave; it also refers to Proclamation No. 889 (habeas corpus, 1971)." },
  { id: "S4", group: "Primary documents", apa: "Republic of the Philippines. (1981). _Proclamation No. 2045, s. 1981: Proclaiming the termination of the state of martial law throughout the Philippines_. The Lawphil Project.", url: "https://lawphil.net/executive/proc/proc1981/proc_2045_1981.html", use: "The official account of why martial law ended, including claims about order, dissent and the economy." },
  { id: "S5", group: "Primary documents", apa: "Republic of the Philippines. (1983). _Proclamation No. 2045-A, s. 1983: Amending portions of Proclamation No. 2045_. The Lawphil Project.", url: "https://lawphil.net/executive/proc/proc1983/proc_2045-a_1983.html", use: "Quotes Proclamation No. 2045's continued suspension of habeas corpus for persons detained for insurrection, rebellion and related offences." },
  { id: "S6", group: "Primary documents", apa: "Republic Act No. 10368, Human Rights Victims Reparation and Recognition Act of 2013 (2013). Supreme Court E-Library.", url: "https://elibrary.judiciary.gov.ph/thebookshelf/showdocs/2/52724", use: "State recognition and reparation for human-rights victims between 21 September 1972 and 25 February 1986." },
  { id: "S7", group: "Primary documents", apa: "Javellana v. Executive Secretary, G.R. No. L-36142, 50 SCRA 30 (1973). ChanRobles Virtual Law Library.", url: "https://chanrobles.com/cralaw/1973marchdecisions.php?id=45", use: "The Supreme Court's decision on the ratification of the 1973 Constitution, with separate concurring and dissenting opinions." },
  { id: "S8", group: "Primary documents", apa: "O'Loughlin, P. (1972, September 25). Island nation awaits reform plans; prominent Filipinos held [Associated Press dispatch]. _The Daily Reflector_ (Greenville, NC). East Carolina University Digital Collections.", url: "https://digital.lib.ecu.edu/encore/ncgre000/00000092/00091719/00091719.pdf", use: "A contemporaneous wire report on the first arrests and the closure of media outlets." },
  { id: "S9", group: "Reports and institutions", apa: "Amnesty International. (1976). _Report of an Amnesty International mission to the Republic of the Philippines, 22 November–5 December 1975_. Amnesty International Publications.", url: "https://www.amnesty.org/es/wp-content/uploads/2021/06/asa350011976en.pdf", use: "Independent documentation of detention under martial law and findings on torture." },
  { id: "S10", group: "Reports and institutions", apa: "University of the Philippines Diliman Office of the Chancellor. (2024). _Proclamation 1081, 23 September 1972_ [Exhibit banner]. Day of Remembrance 2024 outdoor exhibit, with the Ateneo Martial Law Museum and Library.", url: "https://oica.upd.edu.ph/wp-content/uploads/2024/09/09_UPDOR2024_Proclamation_1081.pdf", use: "Arrests of opposition leaders and the military takeover of major media outlets." },
  { id: "S11", group: "Reports and institutions", apa: "University of the Philippines Diliman Office of the Chancellor. (2024). _Plaza Miranda bombing, 21 August 1971_ [Exhibit banner]. Day of Remembrance 2024 outdoor exhibit, with the Ateneo Martial Law Museum and Library.", url: "https://oica.upd.edu.ph/wp-content/uploads/2024/09/04_UPDOR2024_Plaza_Miranda_Bombing.pdf", use: "The bombing, the suspension of the writ, and the competing explanations of responsibility." },
  { id: "S12", group: "Reports and institutions", apa: "University of the Philippines Diliman Office of the Chancellor. (2024). _Lifting of martial law, 17 January 1981_ [Exhibit banner]. Day of Remembrance 2024 outdoor exhibit, with the Ateneo Martial Law Museum and Library.", url: "https://oica.upd.edu.ph/wp-content/uploads/2024/09/19_UPDOR2024_Lifting_of_Martial_Law.pdf", use: "Commentary that extraordinary powers persisted after the formal lifting." },
  { id: "S13", group: "Reports and institutions", apa: "University of the Philippines Diliman Office of the Chancellor. (2024). _[Day of Remembrance 2024 outdoor exhibit on martial law: Timeline banners]_. ", url: "https://oica.upd.edu.ph/?p=9736", use: "Timeline entries on the 22 September 1972 incident involving a defence official's car, described there as an alleged attack." },
  { id: "S14", group: "Reports and institutions", apa: "Center for Media Freedom and Responsibility. (n.d.). _The religious press and the Marcos years_.", url: "https://cmfr-phil.org/media-ethics-responsibility/ethics/the-religious-press-and-the-marcos-years/", use: "How church groups responded to martial law and set up the Task Force Detainees of the Philippines in 1974." },
  { id: "S15", group: "Reports and institutions", apa: "Bantayog ng mga Bayani Foundation. (n.d.). _Dimaranan, Mariani Cuevas_.", url: "https://bantayogngmgabayani.org/?p=1042", use: "Profile of the head of the Task Force Detainees of the Philippines, describing its documentation work." },
  { id: "S16", group: "Scholarship", apa: "Abinales, P. N., & Amoroso, D. J. (2017). _State and society in the Philippines_ (2nd ed.). Rowman & Littlefield.", url: "", use: "General scholarly background on the Marcos period (no specific page is cited for any claim)." },
  { id: "S17", group: "Media and information literacy", apa: "Wardle, C., & Derakhshan, H. (2017). _Information disorder: Toward an interdisciplinary framework for research and policy making_. Council of Europe (Report DGI(2017)09).", url: "https://rm.coe.int/information-disorder-toward-an-interdisciplinary-framework-for-researc/168076277c", use: "Defines misinformation, disinformation and malinformation. Background reading." },
  { id: "S18", group: "Media and information literacy", apa: "Wineburg, S., & McGrew, S. (2017). _Lateral reading: Reading less and learning more when evaluating digital information_ (Working Paper No. 2017-A1). Stanford History Education Group.", url: "https://ssrn.com/abstract=3048994", use: "A study of how fact-checkers judge a source by checking other sources (lateral reading). Background reading." },
  { id: "S19", group: "Media and information literacy", apa: "Wilson, C., Grizzle, A., Tuazon, R., Akyempong, K., & Cheung, C.-K. (2011). _Media and information literacy curriculum for teachers_. UNESCO.", url: "https://unesdoc.unesco.org/ark:/48223/pf0000192971", use: "UNESCO's media and information literacy curriculum for teachers. Background reading." },
  { id: "S20", group: "Project original", apa: "Astartes Studios. (2026). _The Capital Courier_ [Fictional newspaper written for this project]. This website.", url: "", use: "Original classroom scenario. Not a historical document." }
];

/* five threads */
const THREADS = [
  { id: "A", name: "Public order and official narratives", track: "Records", blurb: "How reports frame calm, stability, and government action, and what that wording leaves out.", qs: ["What does “order” mean in this report, and who is measuring it?", "Can a street be quiet and still be under pressure?"], ev: ["p1081", "ap1972", "plaza", "ambush", "language", "econ", "timeline"], claims: ["c1", "c5", "c9"] },
  { id: "B", name: "Political opposition and civil liberties", track: "Records", blurb: "How opponents, arrests, and reports of repression are described, and what the best documentation establishes.", qs: ["Who counts the detained, and why do counts differ?", "What is the difference between a source's label and what the evidence shows?"], ev: ["detain", "ap1972", "amnesty", "counts", "tfdp", "const73", "p1081"], claims: ["c2", "c3", "c8"] },
  { id: "C", name: "The press, omissions, and framing", track: "Press & sources", blurb: "How true statements can be arranged into a misleading impression.", qs: ["Which voices are quoted, and which are absent?", "If every sentence is attributed correctly, can the story still mislead?"], ev: ["media", "ap1972", "mFraming", "mDisorder", "mLateral", "mContra", "revision", "news"], claims: ["c4", "c7", "c9"] },
  { id: "D", name: "The Bartolome household: family, gender, and agency", track: "Household", blurb: "Amanda's experience, family roles, and the link between private life and politics.", qs: ["What does Amanda want, and who benefits from her silence?", "How does the home become a political space?"], ev: ["lAuthor", "lVoice", "lAgency", "lGender", "lFamily", "lAwaken", "lHuman", "lRep", "lQuotes"], claims: [] },
  { id: "E", name: "Historical memory and the limits of evidence", track: "Records & household", blurb: "What records preserve, what they miss, and how to tell an open question from a disproven claim.", qs: ["Whose experiences are best documented?", "What can a household's account show that an archive cannot, and the reverse?"], ev: ["bantayog", "testimony", "counts", "lLimits", "lBridge", "photoStreet", "lift", "revision"], claims: ["c7"] }
];

/* evidence files. auth: A historical record, S secondary interpretation, N newspaper or case-file document, L literary analysis, M reading guide */
const EVIDENCE = [
  {
    id: "news", title: "The Capital Courier, front page", cat: "Newspaper clippings and reports", track: "scenario", auth: "N", date: "Early martial-law period (undated)", threads: ["C", "A", "B"], src: ["S20"], essential: true,
    prov: "Front page of a city daily. No byline; filed under the case file.",
    body: ["Today's front page, as it came in. Every statement is attributed (“officials said”, “a spokesman said”), and some of it may well be accurate. For each one I need to know who is speaking, what they could actually have known, what it establishes, and what isn't there.", "I've underlined the nine claims worth checking one at a time."],
    establishes: "What was said, who said it, and what the paper chose to print.",
    limits: "One front page. It reports statements; it does not check them.",
    q: ["Who produced this report, and for whom?", "Whose voices are missing?"]
  },
  {
    id: "brief", title: "Editor's brief: “Verify, then write”", cat: "Supporting records and timelines", track: "scenario", auth: "N", date: "n.d.", threads: ["C"], src: ["S20"],
    prov: "Note left on the desk by the editor.",
    body: ["Before you file anything on this, keep four piles apart: what the sources establish, what they suggest, what is still unresolved, and what you only feel is true. Only the first three go in the story.", "Three rules. Name the source for every claim. Say what a source cannot tell you. Never file a sentence because it sounds right.", "An allegation is not a finding, and a denial is not a refutation. Say which is which. And don't swing the other way either: not every official statement is false. Check, then write."],
    establishes: "The editor's standing instructions for this file.",
    limits: "Instructions, not evidence about events.",
    q: ["Which of my current beliefs rest on a source I could name?"]
  },
  {
    id: "p1081", title: "Proclamation No. 1081, s. 1972", cat: "Historical records", track: "historical", auth: "A", date: "Dated 21 September 1972; announced publicly on 23 September", threads: ["A", "B"], src: ["S3", "S10"], essential: true,
    prov: "Official government document, as reproduced by a Philippine law library. Summarized in our words; the link is in the Source Register.",
    body: ["The proclamation placed the whole country under martial law. It set out the government's reasons: it described rebellion, violence, sabotage and threats to the Republic, and named communist and other armed groups as part of that danger. It also refers back to Proclamation No. 889 of 21 August 1971, which had suspended the privilege of the writ of habeas corpus.", "It also relied on the President's powers as commander in chief. This is a government text describing the government's own justification. That is its value and its limit.", "Later events are separate questions: how martial law was carried out, who was detained, what happened to the press, and how long it lasted."],
    establishes: "That martial law was formally declared, on what stated grounds, and under what claimed authority.",
    limits: "It cannot show that every stated ground was accurate or that the measures were carried out as described. Those need other sources.",
    q: ["Which parts of this are a legal act, and which are a justification?", "What would you need to test the justification?"]
  },
  {
    id: "timeline", title: "Timeline: 1969 to 1986", cat: "Supporting records and timelines", track: "historical", auth: "S", date: "1969–1986", threads: ["A", "E"], src: ["S3", "S4", "S6", "S11", "S16"],
    prov: "Compiled from the records listed in the Source Register.",
    body: ["1969: Ferdinand Marcos wins re-election, the first Philippine president to do so.", "Early 1970: large student-led protests, later called the First Quarter Storm.", "21 August 1971: grenades explode at a Liberal Party rally at Plaza Miranda. The privilege of the writ of habeas corpus is suspended (Proclamation No. 889) and later modified in stages.", "21–23 September 1972: Proclamation No. 1081 is dated and then announced. Opposition figures and journalists are arrested and many media outlets are shut.", "January 1973: Proclamation No. 1102 declares the new Constitution ratified through citizens' assemblies; the ratification is challenged in court.", "17 January 1981: Proclamation No. 2045 terminates the state of martial law.", "21 August 1983: Benigno Aquino Jr. is assassinated on his return to Manila.", "February 1986: the People Power Revolution. Republic Act No. 10368 treats 25 February 1986 as the end of the period for which victims can claim."],
    establishes: "A sequence of widely documented dates.",
    limits: "A timeline compresses events and says nothing about causes. A date beside another date is not an explanation.",
    q: ["Which entries on this timeline are disputed in cause even if the date is not?"]
  },
  {
    id: "plaza", title: "Plaza Miranda and the suspension of habeas corpus (1971)", cat: "Contextual historical documents", track: "historical", auth: "A", date: "August 1971", threads: ["A"], src: ["S3", "S11"],
    prov: "Proclamation No. 1081 (which cites Proclamation No. 889) and a University of the Philippines Diliman exhibit banner prepared with the Ateneo Martial Law Museum.",
    body: ["Grenades exploded at a Liberal Party rally in Manila on 21 August 1971. The exhibit banner reports nine people killed and 129 injured; other accounts give different casualty counts. President Marcos blamed communists and suspended the privilege of the writ of habeas corpus, a legal safeguard against unlawful detention.", "The same banner notes that others believed Marcos staged the bombing to justify martial law. Some accounts point to communist responsibility instead. Keep three things apart: the event, the government's claim about who did it, and whether that claim has been demonstrated."],
    establishes: "That the bombing happened and that the writ was suspended afterward.",
    limits: "Responsibility for the bombing is disputed in the sources. Treat it as unresolved unless you find strong evidence you can cite.",
    q: ["How does a government claim about cause become “common knowledge”?", "Is “disputed” the same as “unknowable”?"]
  },
  {
    id: "ambush", title: "The 22 September 1972 incident used to justify martial law", cat: "Documents that complicate earlier interpretations", track: "historical", auth: "S", date: "22 September 1972", threads: ["A"], src: ["S13", "S3"],
    prov: "A University of the Philippines Diliman exhibit timeline, read alongside Proclamation No. 1081.",
    body: ["The exhibit timeline describes an alleged attack on the car of the defence official Juan Ponce Enrile on 22 September 1972, and says it was used to demonstrate that peace and order was in dire straits when martial law was declared.", "The word “alleged” matters. A report that an incident happened is not proof of what the incident was or what it proved. A careful reader looks for independent corroboration and notes what remains uncertain."],
    establishes: "That the incident was cited publicly as part of the justification.",
    limits: "The incident itself is described as alleged. Don't print that it was real or staged unless there are strong sources.",
    q: ["What kinds of independent evidence could settle a question like this?"]
  },
  {
    id: "ap1972", title: "Associated Press dispatch, 25 September 1972", cat: "Newspaper clippings and reports", track: "historical", auth: "A", date: "25 September 1972", threads: ["C", "B", "A"], src: ["S8"], essential: true,
    prov: "A wire report by Peter O'Loughlin, printed in a US local newspaper and digitized by East Carolina University. Summarized in our words; read the page scan at the link in the Source Register.",
    body: ["Two days after martial law was announced, an Associated Press writer in Manila reported that the presidential palace had confirmed the arrest of 53 prominent Filipinos in the Manila region, including two provincial governors, six members of Congress and seven newspapermen. The press secretary gave the first official confirmation over the single television channel still operating.", "The same report says that all but selected media outlets had been closed and that news being sent abroad was censored. It also relays President Marcos's stated reasons: an insurrection threatened by communists, and plans for what the government called a new society.", "Notice what the report is: one wire service, one city, one moment, relaying the palace's own announcement while itself operating under censorship."],
    establishes: "That a contemporaneous outside news report recorded arrests of prominent figures and restrictions on media within days of the announcement.",
    limits: "It covers one region and relays an official figure. It cannot show how many people were detained overall or how they were treated.",
    q: ["How does a report made under censorship differ from one made later with archives open?", "What does this wire report corroborate, and what does it not?"]
  },
  {
    id: "media", title: "Media takeover and arrests of journalists", cat: "Historical records", track: "historical", auth: "A", date: "September 1972 onward", threads: ["C"], src: ["S8", "S10"], essential: true,
    prov: "A contemporaneous Associated Press dispatch and a University of the Philippines Diliman exhibit banner.",
    body: ["In the first days of martial law, major newspapers, radio and television stations were closed or placed under military control. The 25 September 1972 Associated Press dispatch says all but selected media outlets were closed and that news sent abroad was censored. The exhibit banner names ABS-CBN and Channel 5 among the outlets taken over.", "Outlets allowed to operate afterward were those the government permitted. The statement “newspapers continue to operate” can therefore be literally true while leaving out which were allowed to publish and under what conditions.", "This matters for reading any report from the period: the absence of criticism in print is not evidence that there was nothing to criticize."],
    establishes: "That the press was heavily restricted under martial law, including closures, takeovers and censorship.",
    limits: "The exact numbers of outlets and individuals vary between accounts. Name the source if you use one.",
    q: ["If the press is controlled, what does a quiet front page tell you?"]
  },
  {
    id: "detain", title: "Detention of political figures at the start of martial law", cat: "Historical records", track: "historical", auth: "A", date: "From 22–23 September 1972", threads: ["B"], src: ["S8", "S10", "S9"],
    prov: "A contemporaneous Associated Press dispatch, a University of the Philippines Diliman exhibit banner, and the Amnesty International mission report.",
    body: ["The 25 September 1972 Associated Press dispatch relayed a palace announcement that 53 prominent Filipinos, including two provincial governors, six members of Congress and seven newspapermen, had been arrested in the Manila region. The exhibit banner names Senators Benigno Aquino Jr. and Jose Diokno among the leaders arrested.", "Amnesty International's 1975 mission later examined detention under martial law and reported prolonged detention without trial. The announced reasons and the documented experiences of detainees are different kinds of evidence and should be kept apart."],
    establishes: "That prominent critics were arrested in the first days, and that detention without trial was documented as a feature of the period.",
    limits: "The first figure is the palace's own announcement as relayed by a wire service, and covers the Manila region only. Most detainees were not famous, and the record of them is thinner.",
    q: ["Why might the famous cases be better documented than the ordinary ones?"]
  },
  {
    id: "amnesty", title: "Amnesty International mission report (1976)", cat: "Testimony or documented personal accounts", track: "historical", auth: "A", date: "Mission 22 November–5 December 1975; published September 1976", threads: ["B"], src: ["S9"],
    prov: "Independent international human-rights organization. Summarized in our words from the published report.",
    body: ["An Amnesty International delegation visited the Philippines in late 1975 to study the problem of detention under martial law. The report records that President Marcos told the delegates they could interview martial-law detainees, that the delegates met difficulties at some detention centres, and that torture was practised against martial-law detainees. It also discusses the government's response and the investigations that followed.", "How to weigh it: it is an outside investigator with its own methods, not the government and not a single victim. It also has limits: access was negotiated, the sample of people interviewed is partial, and the government's own responses are a separate part of the record."],
    establishes: "That an independent mission documented detention conditions and torture allegations under martial law, and that the government responded.",
    limits: "One report, one mission, one period. It does not give a complete count and it should be read together with other sources.",
    q: ["Does independence make a source infallible? What does it make it better at?"]
  },
  {
    id: "counts", title: "Counting the harm: why numbers differ", cat: "Documents that complicate earlier interpretations", track: "historical", auth: "S", date: "Various", threads: ["B", "E"], src: ["S6", "S9"],
    prov: "Republic Act No. 10368 and the Amnesty International mission report. No figures are quoted on purpose.",
    body: ["Different sources count different things. Human-rights organizations and researchers have offered estimates of the scale of what happened. Separately, Republic Act No. 10368 created a legal process, run by a claims board, to recognize and compensate victims whose violations occurred between 21 September 1972 and 25 February 1986 (with limited extension) and who filed and qualified under its standards.", "These do not necessarily contradict each other. One kind of figure estimates scale. The other counts those who filed, qualified and were verified under a legal standard. Different questions produce different numbers."],
    establishes: "That counts should be compared by method, not placed in one column as rival claims.",
    limits: "Don't print any figure until I have the exact number, who produced it, and how it was produced.",
    q: ["What would a person who never filed a claim be missing from?"]
  },
  {
    id: "tfdp", title: "Documentation outside state channels: the Task Force Detainees", cat: "Testimony or documented personal accounts", track: "historical", auth: "S", date: "From 1974", threads: ["B"], src: ["S14", "S15"],
    prov: "A Center for Media Freedom and Responsibility article and a Bantayog ng mga Bayani profile.",
    body: ["In 1974 the Association of Major Religious Superiors in the Philippines set up several task forces, including the Task Force Detainees of the Philippines, which served the needs of political prisoners. The Bantayog profile of Sister Mariani Dimaranan, who headed it for many years, describes its work investigating and documenting abuses and working for detainees' release.", "Records made close to events, by people with access to detainees and families, are a different line of evidence from official statements. They also have limits: they reflect what people brought to the task force and what it could verify."],
    establishes: "That organized documentation existed during the period outside state channels.",
    limits: "Read the task force's own account of its methods before describing how complete its records were.",
    q: ["Why does documentation made at the time carry a different weight than memory recalled later?"]
  },
  {
    id: "const73", title: "The 1973 Constitution and the ratification dispute", cat: "Contextual historical documents", track: "historical", auth: "A", date: "1973", threads: ["B", "A"], src: ["S7", "S16"],
    prov: "Court decision (primary, with separate opinions) and scholarly background.",
    body: ["In January 1973 Proclamation No. 1102 declared the new Constitution ratified through meetings called citizens' assemblies, held under martial law. Challengers argued the process was not a valid ratification.", "In Javellana v. Executive Secretary the Supreme Court disposed of the challenges, but the justices wrote separate concurring and dissenting opinions. Read the decision for how they reasoned, not just the outcome."],
    establishes: "That the Constitution was adopted through a contested process and that the Court was divided in its reasoning.",
    limits: "A court outcome is a legal result, not a verdict on whether the process was free. Read the opinions.",
    q: ["Under restrictions on press and assembly, what does a “yes” vote tell you?"]
  },
  {
    id: "language", title: "The language of order and dissent in an official text", cat: "Documents that complicate earlier interpretations", track: "historical", auth: "S", date: "1981", threads: ["A", "C"], src: ["S4", "S9"],
    prov: "Close reading of the termination proclamation (Proclamation No. 2045), compared with the Amnesty International report.",
    body: ["Proclamation No. 2045 asserts that anarchy had been successfully checked and that, under martial law, legitimate political dissent received full protection while the government stayed vigilant against subversion and violence. It also lists economic growth as an achievement.", "Notice the pattern: positive abstractions (anarchy checked, dissent protected) appear where specific information would be needed to check them (how many were detained, held where, for how long). Compare with the Amnesty mission's findings on detention and torture."],
    establishes: "An interpretation: that an official text leaned on abstractions that are hard to verify and sat beside documented practices that conflict with its tone.",
    limits: "A reading of one text. Weigh it against other official and independent sources before generalizing.",
    q: ["Which words in the Courier article are abstractions? Which are checkable?"]
  },
  {
    id: "econ", title: "Growth and debt: two true stories", cat: "Documents that complicate earlier interpretations", track: "historical", auth: "S", date: "1970s–1980s", threads: ["A", "C"], src: ["S4", "S16"],
    prov: "Proclamation No. 2045 (an official claim) and scholarly background.",
    body: ["Supporters of the regime have pointed to public works and growth. Proclamation No. 2045 itself cites growth in the government budget and capital spending between 1972 and 1981 as an achievement. Scholars have also described heavy foreign borrowing, favours to allies, and a severe economic crisis in the early 1980s.", "Both can be accurate. A report that lists only one is not necessarily lying, but it is selecting. A front page can mislead without a single false line."],
    establishes: "That the economic record is mixed and requires specific data to evaluate.",
    limits: "No figures are used on purpose. Find and cite them yourself from the sources.",
    q: ["Can a list of true facts still lead a reader to a false conclusion?"]
  },
  {
    id: "lift", title: "Martial law lifted, 1981", cat: "Historical records", track: "historical", auth: "A", date: "17 January 1981", threads: ["E"], src: ["S4", "S5", "S12"],
    prov: "Official proclamations and a University of the Philippines Diliman exhibit banner.",
    body: ["Proclamation No. 2045 formally terminated the state of martial law in January 1981, more than eight years after it began. But, as quoted in the 1983 Proclamation No. 2045-A, the earlier proclamation had kept the privilege of the writ of habeas corpus suspended for persons detained for insurrection, rebellion, subversion and related crimes.", "The exhibit banner argues that Marcos kept extraordinary powers through the 1973 Constitution's transitional provisions. Read the proclamations and the commentary together.", "This item tests the word “temporary.” Duration is a fact. Whether the measures were truly temporary is a judgment that needs the evidence of what continued."],
    establishes: "The date of the formal end, the length of the period, and that some suspensions of rights continued after it.",
    limits: "The proclamation tells you what the government said, not what everyday conditions were like afterward.",
    q: ["When an official says “temporary,” what could you compare it to?"]
  },
  {
    id: "bantayog", title: "Bantayog ng mga Bayani: remembrance as documentation", cat: "Testimony or documented personal accounts", track: "historical", auth: "S", date: "n.d.", threads: ["E"], src: ["S15"],
    prov: "A profile published by the Bantayog ng mga Bayani Foundation.",
    body: ["The Bantayog ng mga Bayani honours people who resisted the dictatorship and publishes profiles of them. The profile of Sister Mariani Dimaranan, for example, records her leadership of the Task Force Detainees of the Philippines and her documentation work.", "Memorials do two things at once. They preserve individual lives, and they decide whose lives are recorded. That is why the provenance of any memorial list matters: who submitted, who reviewed, and by what standard."],
    establishes: "That an institution presents documented lives of people who resisted martial law.",
    limits: "One profile does not tell you how the foundation chooses its honourees. Read its own explanation before describing its process.",
    q: ["What does it take for a person's story to be entered into the record?"]
  },
  {
    id: "testimony", title: "Working note: weighing a person's account", cat: "Working notes", track: "media", auth: "M", date: "n.d.", threads: ["E", "B"], src: [],
    prov: "My working notes.",
    body: ["An account from someone who was there is evidence of what they experienced. It gets stronger when it can be placed in time and place, when it matches independent records, and when I know the circumstances in which it was given: when, to whom, under what pressure.", "I don't dismiss an account because it is personal, and I don't treat it as beyond question because it is moving. I ask: Was the person present? How soon afterwards? Who recorded it? Does anything corroborate it?"],
    establishes: "The questions I put to any account.",
    limits: "A method, not a source about the period.",
    q: ["Which would I trust more: an account given years later, or one recorded soon after the events? What does that choice miss?"]
  },
  {
    id: "revision", title: "Rumour and hearsay in the stalls", cat: "Working notes", track: "media", auth: "M", date: "n.d.", threads: ["C", "E"], src: [],
    prov: "My working notes.",
    body: ["When the papers aren't printing, or can't be trusted, people trade what they've heard. Some of it is accurate, some embellished, some invented, and the person repeating it usually believes it.", "I keep a separate list for these: what I heard, who it came from, and whether I can find it written down anywhere else. A rumour can point me to a record. It isn't one."],
    establishes: "How I handle what I hear on the street.",
    limits: "Hearsay tells me what people believe, not what happened.",
    q: ["Which of the things I think I know did I first hear, rather than read?"]
  },
  {
    id: "photoStreet", title: "Photograph: street scene", cat: "Photographs and captions", track: "scenario", auth: "N", date: "Undated", threads: ["E", "C"], src: [],
    prov: "Unattributed print in the case file; provenance unverified. Photographer, date and original caption are unknown.",
    body: ["A faded colour print of a main street lined with shops and hotels, strung with bunting. A jeepney is parked on the left, a motorcycle stands near the kerb, and a few people walk on the right. The street looks quiet.", "A photograph shows one moment from one angle. Quiet streets can be photographed on any day, and nothing in the frame says whether people felt safe, what had happened the night before, or what was kept out of view. A caption would be a claim, and this print has none."],
    establishes: "That this street was photographed at some point.",
    limits: "With no photographer, date or caption, the image cannot support a claim about any particular event.",
    q: ["Could this exact image be offered as proof of calm, or of its opposite?", "What would you need to know before using it in a report?"],
    photo: "assets/photo-street.png"
  },
  {
    id: "photoFamily", title: "Photograph: family portrait", cat: "Photographs and captions", track: "scenario", auth: "N", date: "Undated", threads: ["D"], src: [],
    prov: "Unattributed print in the case file; provenance unverified. Photographer, date and original caption are unknown.",
    body: ["A wedding party posed in front of a church altar: a bride in a lace gown, men in white suits, women in formal dresses, and two small children in front. Someone has written a word in ink along the bottom edge.", "A portrait like this records who stood in front of the camera and when they chose to be photographed. It records nothing of what they had been reading, what they argued about at home, or what they feared that year. Those parts of household life leave few documents behind."],
    establishes: "That these people were photographed together on one occasion.",
    limits: "It does not identify anyone, and it cannot show what any of them thought.",
    q: ["Whose experiences leave documents behind, and whose leave only a photograph?"],
    photo: "assets/photo-family.png"
  },

  /* media literacy */
  {
    id: "mDisorder", title: "Working note: honest mistake, deliberate lie, true facts used to hurt", cat: "Working notes", track: "media", auth: "M", date: "n.d.", threads: ["C"], src: [],
    prov: "My working notes.",
    body: ["Three kinds of wrong, and I handle them differently. An honest mistake: someone got it wrong and passed it on. A deliberate falsehood: someone said what they knew wasn't so, for a reason. And the one that worries me most: true facts used to hurt someone, such as a real name or address handed to people who shouldn't have it.", "Before I decide anything about a story, I ask who made it, what they wanted, and how it got to me."],
    establishes: "Questions to put to any story before I trust it.",
    limits: "A way of sorting. It proves nothing about any particular story.",
    q: ["Where does the Courier piece fall, and what would I need to know to decide?"]
  },
  {
    id: "mLateral", title: "Working note: the second source", cat: "Working notes", track: "media", auth: "M", date: "n.d.", threads: ["C"], src: [],
    prov: "My working notes.",
    body: ["I never judge a source by reading only that source. I find out who else would know: someone who was there, a record kept by someone else, a paper with different interests. Then I see what they say about both the claim and the source.", "In this file that means opening a second item before I decide about the first. The magnifying glass on my desk is for that."],
    establishes: "A habit: check outward before concluding inward.",
    limits: "It only works if the second source is independent.",
    q: ["Who else would have known, and how would I find them?"]
  },
  {
    id: "mLadder", title: "Working note: what I know, what I was told, what I infer", cat: "Working notes", track: "media", auth: "M", date: "n.d.", threads: ["C", "E"], src: ["S20"],
    prov: "My working notes.",
    body: ["Established: independently documented (the proclamation was signed). Claimed: what a particular source says (the spokesman said all detainees were treated fairly). Inferred: what I conclude from the evidence (this suggests complaints were hard to make). My reading: the interpretation that ties the evidence together. Unresolved: the evidence is missing, partial, or conflicting.", "When I write it up it goes in three piles: what the evidence establishes, what it suggests, what remains unresolved. Whatever I only feel stays out of all three."],
    establishes: "How I'm sorting what I find.",
    limits: "Real cases sit between piles. I'll say so when they do.",
    q: ["Which of my notes are established, and which are my own reading?"]
  },
  {
    id: "mFraming", title: "Working note: how the Courier front page is built", cat: "Working notes", track: "media", auth: "M", date: "n.d.", threads: ["C", "A"], src: [],
    prov: "My working notes on the Courier front page.",
    body: ["Ways a truthful report can mislead: omission (who isn't quoted), cherry-picking (the one favourable fact), a single voice standing in for a whole city, abstractions where specifics should be, and juxtaposition (facts set side by side so they seem to cause one another).", "Check the Courier for each. Which are present? Which can't I tell? I'm describing what the text does, not guessing at the writer's motive."],
    establishes: "A checklist for reading a front page.",
    limits: "A pattern can be present without proving intent. I can say what the text leaves out, not what the writer privately thought.",
    q: ["Which of these is easiest to miss when reading quickly?"]
  },
  {
    id: "mContra", title: "Working note: contradiction, difference, or silence?", cat: "Working notes", track: "media", auth: "M", date: "n.d.", threads: ["C", "B"], src: ["S20"],
    prov: "My working notes.",
    body: ["A contradiction: two sources make incompatible claims about the same thing. A difference of emphasis: two sources describe different parts of it. Silence: a source doesn't mention something.", "Silence does not prove falsehood. A newspaper that never mentions a detention hasn't shown there was none. But when a paper is known to operate under restrictions, its silence is weaker evidence than it looks.", "Nor are all disagreements equal. An unsupported denial doesn't weigh what a documented record does."],
    establishes: "The distinctions I use when I set two sources side by side.",
    limits: "Judgment is still required.",
    q: ["Where would I place “no complaints were received”?"]
  },
  {
    id: "mMIL", title: "The reader's side of the page", cat: "Working notes", track: "media", auth: "M", date: "n.d.", threads: ["C"], src: [],
    prov: "My working notes.",
    body: ["Most of what gets printed is about people and read by other people. A reader with no way to check has to decide, at her own table, with what she's been given, what to believe and what to tell her family.", "A front page that counts only what is convenient leaves her to guess at the rest. That cost never appears in the story."],
    establishes: "What a front page asks of the people who read it.",
    limits: "My own reflection, not evidence.",
    q: ["What would a reader need in order to judge the Courier for herself?"]
  },

  /* literary */
 
  {
    id: "lAuthor", title: "The Bartolome household: what I have to go on", cat: "Notes on the Bartolome household", track: "literary", auth: "L", date: "The martial-law decade", threads: ["D"], src: ["S1", "S2"],
    prov: "My field notes, set beside the records.",
    body: ["The household: Amanda Bartolome, a wife and mother of five sons, and her husband, living through the martial-law decade. What I have is an account of those years kept close to the family, told from Amanda's side of the kitchen table.", "It is one household's story, not a record of events. It gives me a lived-in sense of how the decade felt inside one home. It can't tell me what was decided in an office, who was taken, or how many. For that I need the records in the Archive."],
    establishes: "Who is in the household and what kind of material I'm working with.",
    limits: "One household's account. It shows how events were lived, not that they happened.",
    q: ["What does a household know that a front page does not?"]
  },
  {
    id: "lVoice", title: "Amanda's point of view", cat: "Notes on the Bartolome household", track: "literary", auth: "L", date: "n/a", threads: ["D"], src: ["S1"], essential: true,
    prov: "My field notes.",
    body: ["Everything in this account reaches me through Amanda. Politics arrives the way it arrives in most homes: through the newspaper, through arguments at the table, through the lives of her sons, rarely through a speech.", "That means I see what Amanda knows and no more. I watch her interpret what she is told, ask questions, and gradually revise her understanding as more reaches her.", "Note to self: what Amanda knows is not the same as what happened. This is a witness's vantage, and I should read it as one."],
    establishes: "My reading: how Amanda's vantage shapes what I can learn from the account.",
    limits: "One person's view. What she couldn't see, I can't see here.",
    q: ["What does Amanda know at the start of these years, and what does she learn?", "What can a single point of view hide?"]
  },
  {
    id: "lAgency", title: "Amanda's agency and development", cat: "Notes on the Bartolome household", track: "literary", auth: "L", date: "n/a", threads: ["D"], src: ["S1"],
    prov: "My field notes.",
    body: ["Amanda begins as a woman whose role is defined by others: wife, mother, manager of the household. Over these years she questions that role and develops opinions and actions of her own.", "I should be careful not to make her a symbol of “the woman who woke up.” Her change is gradual, uneven, and often costly, and it is shaped by relationships as much as by ideas. I should note the hesitation, the compromise, and the contradiction as well as the breakthroughs."],
    establishes: "My reading: Amanda's arc as a movement from an assigned role toward one of her own.",
    limits: "One scene doesn't make an arc. I'll mark where I'm inferring.",
    q: ["Pick one decision of Amanda's. What did it cost her, and who did it cost?"]
  },
  {
    id: "lGender", title: "Gender expectations in the Bartolome household", cat: "Notes on the Bartolome household", track: "literary", auth: "L", date: "n/a", threads: ["D"], src: ["S1"],
    prov: "My field notes.",
    body: ["The household runs on assumptions about what a wife and mother should do and be. They show up in everyday arrangements: who decides, who defers, whose time and work are treated as free.", "The political story and the household story aren't separate. Amanda learning to speak up at home is tied to learning to speak about public matters. The rules about who may speak do not stop at the front door."],
    establishes: "My reading: the link between power at home and a voice in public.",
    limits: "One household isn't a survey of Filipino women.",
    q: ["Where in this household is silence imposed, and where is it chosen?"]
  },
  {
    id: "lFamily", title: "Family and politics: differing responses", cat: "Notes on the Bartolome household", track: "literary", auth: "L", date: "n/a", threads: ["D"], src: ["S1"],
    prov: "My field notes.",
    body: ["Amanda's husband and sons do not respond to the political situation in the same way. The family holds different attitudes toward authority, protest, safety, and risk. The disagreement isn't only between the household and the state; it runs through the dinner table.", "This corrects any simple story. There isn't one reaction to martial law here, not even under one roof. The household holds a range of responses, and love, fear, and duty complicate each of them."],
    establishes: "My reading: political conflict here is intimate and plural.",
    limits: "A range of responses within one family. It can't stand for everyone's.",
    q: ["Whose response do I understand least, and what does that tell me?"]
  },
  {
    id: "lAwaken", title: "Political awakening", cat: "Notes on the Bartolome household", track: "literary", auth: "L", date: "n/a", threads: ["D", "A"], src: ["S1", "S16"],
    prov: "My field notes, set beside the records.",
    body: ["Her awakening isn't a single moment. It builds from conversations, worries, losses, and the slow realization that what seemed private is shaped by public power.", "Set that beside the records. The proclamation and the press items show institutions and decisions. Her account shows how someone with no institutional power comes to understand those decisions. They don't replace each other, and neither proves the other."],
    establishes: "My reading: political understanding forms in ordinary life, slowly.",
    limits: "The records show what happened. The household's account shows how it might have been understood from inside.",
    q: ["Which record in the Archive best helps me read this stage of Amanda's change, and why?"]
  },
  {
    id: "lHuman", title: "Human consequences", cat: "Notes on the Bartolome household", track: "literary", auth: "L", date: "n/a", threads: ["D", "E"], src: ["S1", "S6"],
    prov: "My field notes, read alongside the state's recognition of victims (RA 10368).",
    body: ["Records say how many. A household's account says what it is like when it is someone's child, someone's husband, someone's afternoon. A mother's fear and loss make large events legible at the scale of one home.", "The record has its own weight: laws, reports, and documented testimony show these were not only private fears. Read together, each strengthens the other without being confused with it."],
    establishes: "My reading: how policy lands on one household.",
    limits: "The records document suffering. The account shows how it is felt at the scale of one home.",
    q: ["What does a number leave out? What does a story leave out?"]
  },
  {
    id: "lRep", title: "What this account chooses to show", cat: "Notes on the Bartolome household", track: "literary", auth: "L", date: "n/a", threads: ["D", "C"], src: ["S1"],
    prov: "My field notes.",
    body: ["Every account is shaped: whose voice tells it, which scenes it lingers on, what it leaves out. This one stays in the kitchen and the living room and follows a family's years. It shows what people said and did at home, and very little of the streets, the offices, or the cells.", "I shouldn't read those gaps as a lack of events. They are a lack of view.", "The Courier leaves things out too, but it presents itself as the whole story. This account is openly one household's. That difference matters when I decide how much weight each can carry."],
    establishes: "My reading: what the household's account shows, what it leaves out, and how that differs from a front page.",
    limits: "What is absent from the account is not absent from events.",
    q: ["What does the account leave out that the Courier includes, and the reverse?"]
  },
  {
    id: "lLimits", title: "What a household's account can and cannot establish", cat: "Notes on the Bartolome household", track: "literary", auth: "L", date: "n/a", threads: ["E", "D"], src: ["S1", "S16"],
    prov: "My working rule for this file.",
    body: ["A household's account can show how people think, feel, and bargain with fear. It can make me notice what documents neglect. By itself it cannot establish that a particular event took place, that someone said a particular thing, or how many were affected.", "So I'm keeping two piles. When I write “the household's account shows,” that is how it was lived. When I write “the records show,” I need a source that can bear the weight."],
    establishes: "The line between how something was lived and whether it happened.",
    limits: "A rule for this file, and one I have to keep applying line by line.",
    q: ["Which line in my notes crosses it?"]
  },
  {
    id: "lBridge", title: "The household and the front page", cat: "Notes on the Bartolome household", track: "literary", auth: "L", date: "n/a", threads: ["E", "C", "D"], src: ["S1"], essential: true,
    prov: "My notes, setting the Courier beside the household's account.",
    body: ["Set the Courier beside the household's account. The front page says calm has returned. In the household, people are deciding what to believe and what to tell the boys.", "Amanda lives in a world of limited and managed information. She has to decide whom to believe, read between the lines, and compare what she is told with what she sees at home.", "Misleading narratives cost real families something, and that cost never appears in the story. And testimony and memory only survive if somebody keeps the record and passes it on."],
    establishes: "What the front page and the household each can and can't tell me.",
    limits: "Two vantage points, and neither is complete.",
    q: ["Where do the household's account and the front page actually disagree?"]
  },
  //add verified short quotations with page numbers from the edition used 
  {
    id: "lQuotes", title: "Moments in the household's account worth a second look", cat: "Notes on the Bartolome household", track: "literary", auth: "L", date: "n/a", threads: ["D"], src: ["S1"],
    prov: "My field notes.",
    body: ["Five moments I keep returning to: a scene where Amanda's role as wife and mother is defined by someone else; a moment where she questions or resists it; a family argument about authority or risk; a moment when news or rumour reaches the household; a scene of consequence or loss.", "For each, I ask who is speaking, what I'm allowed to see, and what I'm not. In my notes I keep three things apart: the exact words, my paraphrase, and my reading."],
    establishes: "Where to look when I reread the account.",
    limits: "Pointers, not quotations. Anything I quote will carry its page number.",
    q: ["Which of these moments tells me most about what the household knew?"]
  }
];

/* claims compare evidence ids with a hint that appears after the player records a decision */
const CLAIMS = [
  {
    id: "c1", short: "“Calm returns to the capital”", thread: "A", text: "CALM RETURNS TO THE CAPITAL as Citizens Resume Daily Routines",
    ctx: "A headline sums up the whole story. It asserts a general condition (calm) without saying how it was measured or whom it covers.",
    qs: ["What does “calm” mean here, and who decided?", "Can streets be calm and people still afraid?", "Is the headline a fact, a summary, or a mood?"],
    ev: ["p1081", "media", "detain", "ap1972"],
    hints: { ap1972: "A contemporaneous wire report records arrests and media closures within days. It bears on “calm” but reports one region at one moment.", p1081: "The proclamation sets the legal context (martial law) but does not measure calm. It adds context rather than supporting or refuting the headline.", media: "If the press is restricted, a report of calm may reflect what could be printed. This is context, not proof the streets were unquiet.", detain: "Arrests and quiet streets can both be true at once. This is a difference of aspect, not an automatic contradiction." }
  },
  {
    id: "c2", short: "“Only a small number detained… treated fairly”", thread: "B", text: "Authorities said only a small number of persons were taken into custody and that all were being treated fairly.",
    ctx: "The sentence is attributed (“authorities said”), so the paper is accurately reporting a claim. But two separate assertions are packed together (the number, and the treatment), and neither is checked.",
    qs: ["Who counted?", "What does “small” mean without a number?", "Who was in a position to say how detainees were treated?", "Does the report cite any independent observer?"],
    ev: ["detain", "amnesty", "counts", "tfdp", "ap1972"],
    hints: { ap1972: "The wire report relays the palace's own figure for the first arrests, which tests “small” but covers only the Manila region.", detain: "Documents prominent detentions at the start of martial law, which tests “small” but does not give a total.", amnesty: "An independent mission's findings bear directly on the “treated fairly” claim, if verified. Note its own limits.", counts: "Differing counts show the number is contested. They do not by themselves prove any specific figure.", tfdp: "Documentation created at the time by non-state groups is a separate line of evidence from the official statement." }
  },
  {
    id: "c3", short: "“A handful of agitators”", thread: "B", text: "Officials attributed the earlier disturbances to a handful of agitators who, they said, sought to exploit public frustration.",
    ctx: "This explains cause by naming a small group. A label like “agitators” characterizes people rather than describing what they did.",
    qs: ["Who is described as an agitator, and by whom?", "Is a cause being offered or demonstrated?", "Does the proclamation describe the threat the same way?"],
    ev: ["p1081", "plaza", "ambush"],
    hints: { p1081: "The government's own proclamation described a broader danger than “a handful.” That is a difference worth noticing in how the same side describes itself.", plaza: "Who caused the 1971 bombing is disputed. A confident attribution at the time is itself a claim to test.", ambush: "A contested justification should be treated as unresolved, not as proof either way." }
  },
  {
    id: "c4", short: "“Newspapers and radio continue to operate normally”", thread: "C", text: "Newspapers and radio stations continue to operate normally, the spokesman said, adding that responsible reporting is welcome.",
    ctx: "“Continue to operate” may be literally true of some outlets while leaving out which were closed and the conditions under which others published. “Responsible” is left undefined.",
    qs: ["Which outlets are meant?", "Who decides what is “responsible”?", "Who could say otherwise in print?"],
    ev: ["media", "detain", "mDisorder", "ap1972"],
    hints: { ap1972: "A wire report from the time states that all but selected outlets were closed and that outgoing news was censored.", media: "The historical record on closures and controls directly bears on “normally.”", detain: "Detained journalists are evidence of limits on reporting.", mDisorder: "My working note on honest mistakes and deliberate falsehoods. It helps me name what I'm looking at; it isn't evidence about what happened." }
  },
  {
    id: "c5", short: "“Markets, schools, offices reopened on schedule”", thread: "A", text: "Markets, schools and offices reopened on schedule, according to a spokesman for the city's coordinating office.",
    ctx: "This is a concrete, plausible, checkable claim. It may well be true. The question is what it is being used to suggest.",
    qs: ["Is this claim likely to be true?", "What does it suggest about the rest of the situation?", "Can a normal market day coexist with the arrest of critics?"],
    ev: ["p1081", "language", "mFraming"],
    hints: { p1081: "The proclamation does not tell you about markets. It supplies the broader context the sentence omits.", language: "Shows how ordinary-life details sit beside abstractions like “discipline.”", mFraming: "Juxtaposition: true details placed together can imply a conclusion the details do not establish." }
  },
  {
    id: "c6", short: "“The measures are temporary”", thread: "A", text: "The measures are temporary, officials said, and will be lifted once conditions allow.",
    ctx: "A statement of intent. It can be tested against what happened later, but it was impossible to verify when printed.",
    qs: ["Is this a prediction, a promise, or a justification?", "What could the reader have compared it to at the time?", "What do we know now?"],
    ev: ["lift", "const73", "timeline"],
    hints: { lift: "Martial law was formally lifted years later (1981). That is a documented fact bearing on “temporary.”", const73: "Institutional changes during the period are part of what “temporary” should be compared to.", timeline: "The sequence of dates is a summary. It supports the duration but not the intention behind the statement." }
  },
  {
    id: "c7", short: "“We feel safe now”: a resident", thread: "C", text: "“We feel safe now,” said one market vendor, who declined to give her name.",
    ctx: "A single, unnamed voice stands in for a city. Its real function in the article is to make the official account feel human.",
    qs: ["Is one quotation evidence of a city's mood?", "Why might someone decline to give a name?", "Whose views are missing?"],
    ev: ["testimony", "mLateral", "lFamily"],
    hints: { testimony: "Provides the questions for weighing a personal account: who, when, under what circumstances?", mLateral: "Check outward: what do other reliable sources say?", lFamily: "The household's account shows fear and disagreement under one roof. It is one family's experience; it doesn't tell me how the whole city felt." }
  },
  {
    id: "c8", short: "“No formal complaint has been received”", thread: "B", text: "“No formal complaint of mistreatment has been received by this office,” he added.",
    ctx: "A true statement about one office's inbox. It says nothing about whether mistreatment occurred, whether people could complain safely, or whether other bodies received complaints.",
    qs: ["Who could file a complaint, and what would it cost them?", "Is absence of complaints evidence of absence of harm?", "Did other organizations receive complaints?"],
    ev: ["amnesty", "tfdp", "mContra", "testimony"],
    hints: { amnesty: "Independent documentation is a different channel than one office's inbox.", tfdp: "Records kept by non-state groups bear on whether complaints existed elsewhere.", mContra: "Explains why silence is not disproof, but also why silence under restrictions is weak evidence.", testimony: "Testimony recorded later has its own strengths and limits to weigh." }
  },
  {
    id: "c9", short: "“New public works prove discipline is working”", thread: "A", text: "Officials point to new public works and rising growth as proof that discipline is working.",
    ctx: "Two possibly true facts (public works, growth) are linked to a conclusion (discipline is working) by the word “proof.” The link is an inference.",
    qs: ["Are the facts accurate?", "Does the evidence show cause?", "What other facts about the same period are not mentioned?"],
    ev: ["econ", "mFraming", "language"],
    hints: { econ: "The economic record includes growth and debt. A statement with only one is selecting, not necessarily false.", mFraming: "Cherry-picking and a causal link implied by arrangement.", language: "Abstractions like “discipline” are hard to test." }
  }
];

/* newspaper layout */
const NEWS = {
  name: "THE CAPITAL COURIER",
  tag: "Metropolitan edition · Morning",
  paras: [
    "[[c5|Markets, schools and offices reopened on schedule]] across the city, according to a spokesman for the city's coordinating office, as vendors returned to their stalls and commuters returned to work.",
    "[[c3|Officials attributed the earlier disturbances to a handful of agitators]] who, they said, sought to exploit public frustration. [[c2|Authorities said only a small number of persons were taken into custody and that all were being treated fairly.]]",
    "[[c4|Newspapers and radio stations continue to operate normally,]] the spokesman said, adding that responsible reporting is welcome. “[[c8|No formal complaint of mistreatment has been received by this office,]]” he added.",
    "[[c7|“We feel safe now,” said one market vendor, who declined to give her name.]] A second resident said she was glad the children could return to class.",
    "[[c6|The measures are temporary, officials said,]] and will be lifted once conditions allow. The coordinating office said it would issue further announcements."
  ]
};

/* investigation questions */
const QUESTIONS = [
  { id: "q1", text: "Who produced this report, and for whom?" },
  { id: "q2", text: "Which voices are missing?" },
  { id: "q3", text: "Does the source support the claim, or does the report infer beyond it?" },
  { id: "q4", text: "Is there independent corroboration?" },
  { id: "q5", text: "What would change my mind?" },
  { id: "q6", text: "What can a household's account show that a record cannot?" },
  { id: "q7", text: "What stays unresolved even after checking?" }
];

/* relation labels for board links */
const RELATIONS = ["Supports", "Contradicts", "Contextualizes", "Raises a question"];

/* comparison classes */
const CLASSES = [
  { v: "supports", t: "Supports the claim" },
  { v: "contradicts", t: "Contradicts the claim" },
  { v: "context", t: "Adds context" },
  { v: "none", t: "Does not establish the claim" },
  { v: "unresolved", t: "Unresolved" }
];

/* dialogue pools: add or edit lines freely */
const DIALOGUE = {
  pen: ["What to write, what to write…", "Gotta take note of this.", "All right. Let's get this down before I forget.", "Now, how do I put this into words?", "Start with the facts. Figure out the rest later.", "Wait, what was that date again?", "I need to find the original source for this.", "That's worth looking into.", "One thing at a time. One thing at a time.", "Am I writing down what it says, or what I think it means?", "Why am I writing again?", "I already wrote this down, didn't I?", "No, that's not quite what I meant.", "I'll make sense of this eventually.", "...Right. Where was I?"],
  plate: ["I'll eat that later.", "It's probably cold by now.", "Did I make it too salty?", "I should probably stop leaving meals on this desk."],
  typewriter: ["One more page. Then I'll take a break.", "How does one machine make this much noise?", "Wonderful. A typo. On the last line.", "That ribbon needs replacing."],
  papers: ["I swear I just had that document.", "These papers are going to bury me.", "This one goes with the other pile. Probably.", "I really need to organize this desk."],
  water: ["When did I last drink this?", "At least this is still here.", "I should refill this before I forget."],
  calendar: ["Another day gone already?", "I need to check that date again.", "I should have written the deadline down."],
  lamp: ["That's better. I can read my own handwriting now.", "Too bright. Too dim. Never just right.", "The bulb is going to go any day now."],
  radio: ["Some noise helps me think. Usually.", "Still tuned to the only thing it can play.", "Quiet, please. I'm working. Oh. It's me."],
  radioJoke: ["I knew I should've bought from a different shop, this thing only has a volume option. You can't even change the channel! What a sham."],
  photos: ["Who took this, and when? Always ask.", "A photo shows one moment. Not the whole story.", "I should write the caption on the back before I forget."],
  folders: ["Five threads. Not one single story.", "Everything in here has a source. Allegedly.", "I'll sort these properly. Eventually."],
  archive: ["The drawer sticks. It always sticks.", "Everything is in here somewhere.", "Smells like paper and old coffee."],
  board: ["Strings on a corkboard. Don't let them fool you: a line is not proof.", "If two things connect, say why.", "Pins, paper, and a lot of doubt."],
  newspaper: ["Let's see what the paper says. And what it doesn't.", "True sentences can still add up to the wrong story.", "Who is speaking? That's the first thing to ask."],
  notebook: ["My own words, not the source's. Keep them apart.", "Let me see what I wrote so far.", "Nothing in here is proven. It's just what I think."],
  clips: ["One paperclip. Two paperclips. Where do they all go?", "Useful, until they hook onto everything.", "I'm not going to count how many of these I own."],
  magnifier: ["Closer look. Compare one source against another.", "It makes the print bigger, not truer.", "Let's compare notes."],
  mug: ["Cold coffee. Again.", "There's a ring on that paper. Not the first.", "I'll microwave it. In a minute. Maybe."],
  dossier: ["Case file seven. Still thinner than I'd like.", "Everything in here has a source. I should know which.", "The page of unanswered questions is the longest one.", "Start from what I can show, not from what I suspect."],
};

/* extra lines that appear only when a condition is true */
const DIALOGUE_PROGRESS = [
  { obj: "newspaper", when: s => Object.keys(s.claimsSeen).length >= 5, lines: ["Several claims checked. A few still bother me."] },
  { obj: "notebook", when: s => s.notes.length === 0, lines: ["Nothing written down yet. My own thoughts go in here."] },
  { obj: "board", when: s => s.board.links.length === 0, lines: ["The board needs its first string."] },
  { obj: "calendar", when: s => s.report.finalized, lines: ["Deadline met. I think."] },
  { obj: "typewriter", when: s => s.report.entries.length > 0 && !s.report.finalized, lines: ["The report is taking shape. Careful with the wording."] },
  { obj: "folders", when: s => Object.keys(s.inspected).length >= 10, lines: ["That's a fair stack of evidence now."] }
];

/* easter egg */
const DORO = {
  reaction: "Doro? What the hell is even that. These satire articles are getting out of hand.",
  paper: "THE DAILY SCREAMER",
  tag: "Action · Real Time · Definitely a newspaper",
  headline: "DORO ATTACKS TOKYO!",
  deck: "Unbothered menace flattens skyline; pigeons “deeply confused”",
  caption: "Artist's impression. Possibly.",
  paras: [
    "TOKYO. Residents awoke to find a round, thoroughly unbothered figure known only as “Doro” strolling through the capital's busiest districts, leaving behind toppled vending machines, flattened billboards, and a pile of absurdly massive oranges.",
    "Eyewitnesses described the creature as “completely calm” as it built a tower of oranges in Kyoto before marching towards Tokyo. Commuters were seen fleeing in every direction, several still holding their lunch as the creature threw what seemed like pipe bombs at Mount Fuji.",
    "It seems the Raptures have formed an unlikely alliance with humanity to stop the threat. Sources close to nobody say both sides agreed on exactly one point: this was not on the schedule.",
    "At press time, Doro had reportedly stopped to look at a ramen stall, then continued throwing oranges at the military aircraft trying to contain it."
  ],
  ghost: "THE TRUTH OF DORO",
  notice: "Learn more at the Truth for the Masses paper coming this week!.",
  img: "assets/doro-attacks-tokyo.jpg",
  clip: "assets/doro-article.png",
  video: "assets/doro-truth.mp4"
};

/* case dossier on the desk */
const DOSSIER = {
  title: "CASE FILE 07",
  subtitle: "The story behind the headlines",
  note: [
    "Two things on my desk won't agree. The Courier says calm has returned to the capital. The other pieces I've kept say people were taken from their homes and the presses were shut.",
    "Both could be true, depending on what each one counts and who was allowed to speak. I don't know yet. That's why this file exists.",
    "House rules: write down who said it, what they could actually have known, and what the story leaves out. Don't copy a headline. Don't wave away a source because I dislike it, and don't trust one because I like it."
  ],
  leads: [
    { kind: "claim", id: "c1", title: "Start here: “Calm returns to the capital”", why: "Calm by whose measure? A quiet street and a safe street aren't the same thing." },
    { kind: "claim", id: "c2", title: "“Only a small number” in custody", why: "The paper gives no number. A wire report from the same week does. Put them side by side." },
    { kind: "ev", id: "media", title: "The papers that weren't printed", why: "If the presses were closed, what does a calm front page tell me?" },
    { kind: "ev", id: "p1081", title: "The proclamation itself", why: "Read what it says, not what people say it says." },
    { kind: "ev", id: "plaza", title: "Plaza Miranda, 1971", why: "Everyone has an answer for who did it. I have a handful of facts." },
    { kind: "ev", id: "lVoice", title: "A household reading the paper", why: "The vendor in the Courier is quoted once and never named. What about the wife at the kitchen table, deciding what to tell her sons?" },
    { kind: "claim", id: "c3", title: "Unfinished: “a handful of agitators”", why: "Haven't worked out who they mean, or who counted them." }
  ],
  questions: [
    "What does each report emphasise? What does it leave out?",
    "Who is quoted, and who isn't asked?",
    "Is a number given? Who counted?",
    "What could this source actually have known?",
    "Whose experience never reaches print?",
    "What would change my mind?"
  ],
  chrono: [
    { when: "Aug 1971", what: "Bombing at a rally at Plaza Miranda; habeas corpus suspended", ev: "plaza" },
    { when: "21–23 Sept 1972", what: "Martial law proclaimed and announced", ev: "p1081" },
    { when: "25 Sept 1972", what: "Wire report: prominent arrests, most media closed", ev: "ap1972" },
    { when: "Jan 1973", what: "New Constitution declared ratified; challenged in court", ev: "const73" },
    { when: "17 Jan 1981", what: "Martial law formally lifted", ev: "lift" },
    { when: "Feb 1986", what: "People Power; the period closes", ev: "timeline" }
  ],
  open: "If every sentence in the Courier is accurately attributed, can the story still be wrong? And if it can, how would anyone reading it that morning have known?"
};
