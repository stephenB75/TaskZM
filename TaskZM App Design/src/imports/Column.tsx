import svgPaths from "./svg-wtgnewrqqx";
import imgEllipse1 from "figma:asset/d27a4024b461a05be4dc5d2794f44523e1a6d307.png";
import imgIcon from "figma:asset/963deb7708a8414668396d1993b85035b01204ff.png";
import imgEllipse2 from "figma:asset/0b09f1f030532c052b907665b73802b76fc8d1f2.png";

function ColumnHeader() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[12.082px] items-center justify-center px-[28.996px] py-[14.498px] relative shrink-0 w-[376.942px]" data-name="Column Header">
      <div aria-hidden="true" className="absolute border-[#f4f4f4] border-[0px_0px_1.208px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['DM_Sans:Regular',_sans-serif] font-normal grow leading-[28.996px] min-h-px min-w-px relative shrink-0 text-[#313131] text-[19.33px] text-center uppercase" style={{ fontVariationSettings: "'opsz' 14" }}>
        To do
      </p>
    </div>
  );
}

function Tag1() {
  return (
    <div className="bg-[#fbe6fc] box-border content-stretch flex gap-[4.833px] items-center px-[9.665px] py-[4.833px] relative rounded-[4.833px] shrink-0" data-name="Tag">
      <p className="font-['DM_Sans:Bold',_sans-serif] font-bold leading-[16.914px] relative shrink-0 text-[#ff00b8] text-[12.081px] text-nowrap whitespace-pre" style={{ fontVariationSettings: "'opsz' 14" }}>
        UX
      </p>
    </div>
  );
}

function Tag2() {
  return (
    <div className="bg-[#d9f4f8] box-border content-stretch flex gap-[4.833px] items-center px-[9.665px] py-[4.833px] relative rounded-[4.833px] shrink-0" data-name="Tag">
      <p className="font-['DM_Sans:Bold',_sans-serif] font-bold leading-[16.914px] relative shrink-0 text-[#268fb0] text-[12.081px] text-nowrap whitespace-pre" style={{ fontVariationSettings: "'opsz' 14" }}>
        Research
      </p>
    </div>
  );
}

function Tags() {
  return (
    <div className="content-start flex flex-wrap gap-[9.665px] items-start relative shrink-0 w-full" data-name="Tags">
      <Tag1 />
      <Tag2 />
    </div>
  );
}

function Priority() {
  return (
    <div className="relative shrink-0 size-[26.579px]" data-name="Priority">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27 27">
        <g id="Priority">
          <path d={svgPaths.p38c9ab00} id="Vector" stroke="var(--stroke-0, #EC6240)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.41629" />
        </g>
      </svg>
    </div>
  );
}

function TitlePriority() {
  return (
    <div className="content-stretch flex gap-[4.833px] items-start relative shrink-0 w-full" data-name="Title + Priority">
      <p className="basis-0 font-['DM_Sans:Medium',_sans-serif] font-medium grow leading-[26.579px] min-h-px min-w-px relative shrink-0 text-[#313131] text-[19.33px]" style={{ fontVariationSettings: "'opsz' 14" }}>
        Conduct User Interviews
      </p>
      <Priority />
    </div>
  );
}

function TitleDescription() {
  return (
    <div className="content-stretch flex flex-col gap-[4.833px] items-start relative shrink-0 w-full" data-name="Title + Description">
      <TitlePriority />
      <p className="font-['DM_Sans:Regular',_sans-serif] font-normal leading-[19.33px] relative shrink-0 text-[#828282] text-[14.498px] w-full" style={{ fontVariationSettings: "'opsz' 14" }}>
        Schedule and conduct user interviews to gather valuable insights for the user experience design
      </p>
    </div>
  );
}

function TablerIconLink() {
  return (
    <div className="relative shrink-0 size-[19.33px]" data-name="tabler-icon-link">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="tabler-icon-link">
          <path d={svgPaths.p2196b780} id="Vector" stroke="var(--stroke-0, #828282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.20815" />
          <path d={svgPaths.p289dba00} id="Vector_2" stroke="var(--stroke-0, #828282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.20815" />
          <path d={svgPaths.p39db8f80} id="Vector_3" stroke="var(--stroke-0, #828282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.20815" />
        </g>
      </svg>
    </div>
  );
}

function Url() {
  return (
    <div className="content-stretch flex gap-[4.833px] items-start relative shrink-0" data-name="URL">
      <TablerIconLink />
      <p className="font-['DM_Sans:Regular',_sans-serif] font-normal leading-[19.33px] relative shrink-0 text-[#313131] text-[14.498px] text-nowrap whitespace-pre" style={{ fontVariationSettings: "'opsz' 14" }}>
        Link to interview questions
      </p>
    </div>
  );
}

function Links() {
  return (
    <div className="content-start flex flex-wrap gap-[14.498px] items-start relative shrink-0 w-full" data-name="Links">
      <Url />
    </div>
  );
}

function Notes() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Notes">
      <div className="absolute bottom-0 left-0 right-0 top-[-1.21px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 281 2">
          <g id="Notes">
            <line id="Line 1" stroke="var(--stroke-0, #E3E3E3)" strokeWidth="1.20815" x2="280.29" y1="1.39593" y2="1.39593" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Notes1() {
  return <div className="h-0 shrink-0 w-full" data-name="Notes" />;
}

function TeamMember() {
  return (
    <div className="content-stretch flex gap-[9.665px] items-center relative rounded-[1206.94px] shrink-0" data-name="TeamMember">
      <div className="relative shrink-0 size-[19.33px]">
        <img alt="" className="block max-w-none size-full" height="19.33" src={imgEllipse1} width="19.33" />
      </div>
      <p className="font-['DM_Sans:Regular',_sans-serif] font-normal leading-[19.33px] relative shrink-0 text-[14.498px] text-black text-nowrap whitespace-pre" style={{ fontVariationSettings: "'opsz' 14" }}>
        Sarah Johnson
      </p>
    </div>
  );
}

function TablerIconCalendarEvent() {
  return (
    <div className="relative shrink-0 size-[19.33px]" data-name="tabler-icon-calendar-event">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="tabler-icon-calendar-event">
          <path d={svgPaths.p27121100} id="Vector" stroke="var(--stroke-0, #828282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.20815" />
        </g>
      </svg>
    </div>
  );
}

function Date() {
  return (
    <div className="content-stretch flex gap-[4.833px] items-center justify-end relative shrink-0" data-name="Date">
      <TablerIconCalendarEvent />
      <p className="font-['DM_Sans:Regular',_sans-serif] font-normal leading-[19.33px] relative shrink-0 text-[#828282] text-[14.498px] text-nowrap whitespace-pre" style={{ fontVariationSettings: "'opsz' 14" }}>
        20 Aug
      </p>
    </div>
  );
}

function TeamMemberDueDate() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Team member + Due date">
      <TeamMember />
      <Date />
    </div>
  );
}

function Card() {
  return (
    <div className="bg-white box-border content-stretch flex flex-col gap-[14.498px] items-start p-[19.33px] relative rounded-[14.498px] shrink-0 w-[318.951px]" data-name="Card">
      <div aria-hidden="true" className="absolute border-[#e3e3e3] border-[1.208px] border-solid inset-0 pointer-events-none rounded-[14.498px] shadow-[53.158px_67.656px_24.163px_0px_rgba(0,0,0,0),33.828px_43.493px_21.747px_0px_rgba(0,0,0,0),19.33px_24.163px_18.122px_0px_rgba(0,0,0,0.01),8.457px_10.873px_13.29px_0px_rgba(0,0,0,0.01),2.416px_2.416px_7.249px_0px_rgba(0,0,0,0.01),0px_0px_0px_0px_rgba(0,0,0,0.01)]" />
      <Tags />
      <TitleDescription />
      <Links />
      <Notes />
      <Notes1 />
      <TeamMemberDueDate />
      <div className="absolute bg-[#3300ff] h-[60.407px] left-[-1.21px] rounded-[12080.3px] top-[55.58px] w-[3.624px]" />
    </div>
  );
}

function Tag3() {
  return (
    <div className="bg-[#ffece1] box-border content-stretch flex gap-[4.833px] items-center px-[9.665px] py-[4.833px] relative rounded-[4.833px] shrink-0" data-name="Tag">
      <p className="font-['DM_Sans:Medium',_sans-serif] font-medium leading-[16.914px] relative shrink-0 text-[#ff5c00] text-[12.081px] text-nowrap whitespace-pre" style={{ fontVariationSettings: "'opsz' 14" }}>
        Initial design
      </p>
    </div>
  );
}

function Tag4() {
  return (
    <div className="bg-[#e1f6ff] box-border content-stretch flex gap-[4.833px] items-center px-[9.665px] py-[4.833px] relative rounded-[4.833px] shrink-0" data-name="Tag">
      <p className="font-['DM_Sans:Bold',_sans-serif] font-bold leading-[16.914px] relative shrink-0 text-[#2c62b4] text-[12.081px] text-nowrap whitespace-pre" style={{ fontVariationSettings: "'opsz' 14" }}>
        UI
      </p>
    </div>
  );
}

function Tags1() {
  return (
    <div className="content-start flex flex-wrap gap-[9.665px] items-start relative shrink-0 w-full" data-name="Tags">
      <Tag3 />
      <Tag4 />
    </div>
  );
}

function Priority1() {
  return (
    <div className="relative shrink-0 size-[26.579px]" data-name="Priority">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27 27">
        <g id="Priority">
          <path d={svgPaths.p2ac5b6c0} id="Vector" stroke="var(--stroke-0, #EC6240)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.41629" />
          <path d={svgPaths.p91a3000} id="Vector_2" stroke="var(--stroke-0, #EE7C5C)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.41629" />
        </g>
      </svg>
    </div>
  );
}

function TitlePriority1() {
  return (
    <div className="content-stretch flex gap-[4.833px] items-start relative shrink-0 w-full" data-name="Title + Priority">
      <p className="basis-0 font-['DM_Sans:Medium',_sans-serif] font-medium grow leading-[26.579px] min-h-px min-w-px relative shrink-0 text-[#313131] text-[19.33px]" style={{ fontVariationSettings: "'opsz' 14" }}>
        Develop Homepage Mockup
      </p>
      <Priority1 />
    </div>
  );
}

function TitleDescription1() {
  return (
    <div className="content-stretch flex flex-col gap-[4.833px] items-start relative shrink-0 w-full" data-name="Title + Description">
      <TitlePriority1 />
      <p className="font-['DM_Sans:Regular',_sans-serif] font-normal leading-[19.33px] relative shrink-0 text-[#828282] text-[14.498px] w-full" style={{ fontVariationSettings: "'opsz' 14" }}>
        Design the mockup for the homepage using the insights gathered from the initial design phase
      </p>
    </div>
  );
}

function FileIcon1() {
  return (
    <div className="overflow-clip relative shrink-0 size-[19.33px]" data-name="FileIcon">
      <div className="absolute left-[2.42px] size-[14.498px] top-[2.42px]" data-name="Icon">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgIcon} />
      </div>
    </div>
  );
}

function File1() {
  return (
    <div className="content-stretch flex gap-[4.833px] items-start relative shrink-0" data-name="File">
      <FileIcon1 />
      <p className="font-['DM_Sans:Regular',_sans-serif] font-normal leading-[19.33px] relative shrink-0 text-[#313131] text-[14.498px] text-nowrap whitespace-pre" style={{ fontVariationSettings: "'opsz' 14" }}>
        Working file
      </p>
    </div>
  );
}

function Files() {
  return (
    <div className="content-start flex flex-wrap gap-[14.498px] items-start relative shrink-0 w-full" data-name="Files">
      <File1 />
    </div>
  );
}

function TablerIconLink1() {
  return (
    <div className="relative shrink-0 size-[19.33px]" data-name="tabler-icon-link">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="tabler-icon-link">
          <path d={svgPaths.p2196b780} id="Vector" stroke="var(--stroke-0, #828282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.20815" />
          <path d={svgPaths.p1875720} id="Vector_2" stroke="var(--stroke-0, #828282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.20815" />
          <path d={svgPaths.p18a18c00} id="Vector_3" stroke="var(--stroke-0, #828282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.20815" />
        </g>
      </svg>
    </div>
  );
}

function Url1() {
  return (
    <div className="content-stretch flex gap-[4.833px] items-start relative shrink-0" data-name="URL">
      <TablerIconLink1 />
      <p className="font-['DM_Sans:Regular',_sans-serif] font-normal leading-[19.33px] relative shrink-0 text-[#313131] text-[14.498px] text-nowrap whitespace-pre" style={{ fontVariationSettings: "'opsz' 14" }}>
        Brief
      </p>
    </div>
  );
}

function Links1() {
  return (
    <div className="content-start flex flex-wrap gap-[14.498px] items-start relative shrink-0 w-full" data-name="Links">
      <Url1 />
    </div>
  );
}

function Notes2() {
  return (
    <div className="content-stretch flex flex-col gap-[4.833px] items-start relative shrink-0 w-full" data-name="Notes">
      <p className="font-['DM_Sans:Medium',_sans-serif] font-medium leading-[16.914px] relative shrink-0 text-[#828282] text-[12.081px] w-full" style={{ fontVariationSettings: "'opsz' 14" }}>
        Notes:
      </p>
      <p className="font-['DM_Sans:Regular',_sans-serif] font-normal leading-[19.33px] relative shrink-0 text-[#313131] text-[14.498px] w-full" style={{ fontVariationSettings: "'opsz' 14" }}>{`Incorporate brand colors, typography, and imagery consistent with the established design system. Seek feedback from stakeholders to ensure the mockup aligns with the project's vision and goals before proceeding to the next design phase.`}</p>
    </div>
  );
}

function Notes3() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Notes">
      <div className="absolute bottom-0 left-0 right-0 top-[-1.21px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 281 2">
          <g id="Notes">
            <line id="Line 1" stroke="var(--stroke-0, #E3E3E3)" strokeWidth="1.20815" x2="280.29" y1="1.39593" y2="1.39593" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Notes4() {
  return <div className="h-0 shrink-0 w-full" data-name="Notes" />;
}

function TeamMember1() {
  return (
    <div className="content-stretch flex gap-[9.665px] items-center relative rounded-[1206.94px] shrink-0" data-name="TeamMember">
      <div className="relative shrink-0 size-[19.33px]">
        <img alt="" className="block max-w-none size-full" height="19.33" src={imgEllipse2} width="19.33" />
      </div>
      <p className="font-['DM_Sans:Regular',_sans-serif] font-normal leading-[19.33px] relative shrink-0 text-[14.498px] text-black text-nowrap whitespace-pre" style={{ fontVariationSettings: "'opsz' 14" }}>
        Jane Smith
      </p>
    </div>
  );
}

function TablerIconCalendarEvent1() {
  return (
    <div className="relative shrink-0 size-[19.33px]" data-name="tabler-icon-calendar-event">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="tabler-icon-calendar-event">
          <path d={svgPaths.p27121100} id="Vector" stroke="var(--stroke-0, #828282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.20815" />
        </g>
      </svg>
    </div>
  );
}

function Date1() {
  return (
    <div className="content-stretch flex gap-[4.833px] items-center justify-end relative shrink-0" data-name="Date">
      <TablerIconCalendarEvent1 />
      <p className="font-['DM_Sans:Regular',_sans-serif] font-normal leading-[19.33px] relative shrink-0 text-[#828282] text-[14.498px] text-nowrap whitespace-pre" style={{ fontVariationSettings: "'opsz' 14" }}>
        25 Aug
      </p>
    </div>
  );
}

function TeamMemberDueDate1() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Team member + Due date">
      <TeamMember1 />
      <Date1 />
    </div>
  );
}

function Card1() {
  return (
    <div className="bg-white box-border content-stretch flex flex-col gap-[14.498px] items-start p-[19.33px] relative rounded-[14.498px] shrink-0 w-[318.951px]" data-name="Card">
      <div aria-hidden="true" className="absolute border-[#e3e3e3] border-[1.208px] border-solid inset-0 pointer-events-none rounded-[14.498px] shadow-[53.158px_67.656px_24.163px_0px_rgba(0,0,0,0),33.828px_43.493px_21.747px_0px_rgba(0,0,0,0),19.33px_24.163px_18.122px_0px_rgba(0,0,0,0.01),8.457px_10.873px_13.29px_0px_rgba(0,0,0,0.01),2.416px_2.416px_7.249px_0px_rgba(0,0,0,0.01),0px_0px_0px_0px_rgba(0,0,0,0.01)]" />
      <Tags1 />
      <TitleDescription1 />
      <Files />
      <Links1 />
      <Notes2 />
      <Notes3 />
      <Notes4 />
      <TeamMemberDueDate1 />
      <div className="absolute bg-[#3300ff] h-[60.407px] left-[-1.21px] rounded-[12080.3px] top-[55.58px] w-[3.624px]" />
    </div>
  );
}

export default function Column() {
  return (
    <div className="bg-[#fdfdfd] relative rounded-[11.567px] size-full" data-name="Column">
      <div className="box-border content-stretch flex flex-col gap-[19.33px] items-center overflow-clip pb-[28.996px] pt-0 px-0 relative size-full">
        <ColumnHeader />
        <Card />
        <Card1 />
      </div>
      <div aria-hidden="true" className="absolute border-[#e3e3e3] border-[1.208px] border-solid inset-[-1.208px] pointer-events-none rounded-[12.7751px] shadow-[39.651px_39.651px_99.128px_0px_rgba(0,0,0,0.03)]" />
    </div>
  );
}