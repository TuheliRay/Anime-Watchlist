export default function Header({ref}){
    return(
        <main ref={ref} className="max-w-6xl mx-auto py-8 px-6">
        <section className="text-center py-6">
          <h2 className="text-5xl font-extrabold text-pink-400 drop-shadow-lg">My Anime Watchlist</h2>
          <p className="mt-3 text-gray-300">Your personal space to track amazing anime.</p>
        </section>
        </main>
    )
}