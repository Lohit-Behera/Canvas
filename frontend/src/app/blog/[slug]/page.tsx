"use client";

function page({ params }: { params: { slug: string } }) {
  return (
    <div>
      <h1 className="text-3xl font-bold underline">Blog</h1>
    </div>
  );
}

export default page;
