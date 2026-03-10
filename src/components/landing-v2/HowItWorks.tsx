const steps = [
  {
    number: '1',
    title: 'Connect Your Accounts',
    description:
      'Securely link your banks, investments, and financial accounts in seconds with bank-level encryption.',
  },
  {
    number: '2',
    title: 'Set Your Goals',
    description:
      'Tell Poseidon what matters most to you — saving for retirement, reducing risk, optimizing taxes, or all of the above.',
  },
  {
    number: '3',
    title: 'Let AI Orchestrate',
    description:
      'Watch as four specialized engines work together to protect, grow, execute, and govern your financial life.',
  },
]

export default function HowItWorks() {
  return (
    <section className="bg-[#F4F4F5] py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-[#0A1628]">
          Get Started in Minutes
        </h2>

        <div className="flex flex-col md:flex-row justify-between gap-8 mt-16">
          {steps.map((step) => (
            <div key={step.number} className="flex-1 text-center md:text-left">
              <div className="w-12 h-12 rounded-full bg-[#0A1628] text-white flex items-center justify-center text-lg font-bold mx-auto md:mx-0">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold text-[#0A1628] mt-4">
                {step.title}
              </h3>
              <p className="text-zinc-500 mt-2">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
