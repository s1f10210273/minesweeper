import Board from '@/components/board';

export default function Home() {
  return (
    <>
      <Board row={10} col={10} mines={15} />
    </>
  );
}
