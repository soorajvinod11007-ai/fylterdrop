import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Damaged Product Refund Policy",
  description:
    "Learn the unboxing video requirement for refund requests for damaged products.",
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#faf7f1] py-12 text-[#302c27] sm:py-16">
      <article className="mx-auto max-w-3xl space-y-6 px-4 sm:px-6 lg:px-8">
        <header className="space-y-4">
          <h1 className="text-3xl font-medium leading-tight sm:text-4xl">
            Damaged Product Refund Policy
          </h1>
          <p className="text-sm leading-relaxed text-[#665f56] sm:text-base">
            We want you to be happy with every order. If your product arrives
            damaged, you may be eligible for a refund, provided you follow the
            requirement below.
          </p>
        </header>

        <section
          aria-labelledby="unboxing-video-heading"
          className="space-y-4 rounded-xl border border-[#e8dfd3] border-l-4 border-l-[#a44f3d] bg-[#fffdf8] p-5 sm:p-7"
        >
          <h2
            id="unboxing-video-heading"
            className="text-xl font-medium sm:text-2xl"
          >
            Unboxing video is required
          </h2>
          <p className="text-sm leading-relaxed text-[#665f56] sm:text-base">
            To claim a refund for a damaged product, you must have recorded a
            continuous video of the package being opened. The video must:
          </p>
          <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-[#665f56] sm:text-base">
            <li>
              Start before you open the package, with the sealed parcel and its
              shipping label visible
            </li>
            <li>
              Continue without cuts or pauses until the product is fully
              unpacked
            </li>
            <li>Clearly show the damage to the product</li>
          </ul>
        </section>

        <p className="text-sm leading-relaxed text-[#665f56] sm:text-base">
          Refund requests for damaged items without a valid unboxing video
          cannot be accepted. We recommend recording the video every time you
          open a delivery so that you are covered.
        </p>
      </article>
    </div>
  );
}
