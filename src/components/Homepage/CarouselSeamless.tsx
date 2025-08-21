const CarouselSeamless = () => {
    return <>
        <div>
            <div className="w-full bg-gradient-to-r from-[#AA0400] to-[#EB7900] p-4 text-white overflow-hidden py-4 mb-5">
                <div className="flex whitespace-nowrap gap-10 animate-marquee font-medium items-center  uppercase">
                    {/* First block */}
                    <div className="flex items-center space-x-10 shrink-0">
                        <div className="flex items-center gap-2 text-white">
                            <span>OUR BEST SELLERS</span>
                        </div>
                        <div className="flex items-center gap-2 text-white">
                            <span>OUR BEST SELLERS</span>
                        </div>
                    </div>

                    {/* Duplicate block for seamless loop */}
                    <div className="flex items-center space-x-10 shrink-0">
                        <div className="flex items-center gap-2 text-white">
                            <span>OUR BEST SELLERS</span>
                        </div>
                        <div className="flex items-center gap-2 text-white">
                            <span>OUR BEST SELLERS</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-10 shrink-0">
                        <div className="flex items-center gap-2 text-white">
                            <span>OUR BEST SELLERS</span>
                        </div>
                        <div className="flex items-center gap-2 text-white">
                            <span>OUR BEST SELLERS</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-10 shrink-0">
                        <div className="flex items-center gap-2 text-white">
                            <span>OUR BEST SELLERS</span>
                        </div>
                        <div className="flex items-center gap-2 text-white">
                            <span>OUR BEST SELLERS</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}
export default CarouselSeamless;