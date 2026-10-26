// ponytail: 사업자 정보는 아직 가짜 값이다. 실제 값이 정해지면 바꾼다
export default function StoreFooter() {
  return (
    <footer className="mt-20 border-t border-[#ebebeb] bg-white text-xs leading-[1.7] text-[#666]">
      <div className="mx-auto max-w-[1440px] px-5 py-6">
        <p>
          <strong className="font-bold">성원종합주방</strong> · 대표자 ○○○ · 사업자등록번호
          000-00-00000 · 통신판매업 신고 제0000-서울○○-0000호
        </p>
        <p>주소 서울시 ○○구 ○○로 00 · 고객센터 02-000-0000 (평일 09:00~18:00)</p>
      </div>
    </footer>
  );
}
