import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

export const PosterCardSkeleton = ({ count = 6 }) => {
    return (
        <SkeletonTheme baseColor="#14213d" highlightColor="#1f2d4d">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-2.5 md:gap-x-5 gap-y-3 md:gap-y-5 pt-5 pb-5 w-full px-1.5 md:px-4">
                {Array(count).fill(0).map((_, i) => (
                    <div key={i} className="flex flex-col gap-2">
                        <Skeleton height={260} className="rounded-md" />
                        <Skeleton height={20} width="80%" />
                        <Skeleton height={15} width="40%" />
                    </div>
                ))}
            </div>
        </SkeletonTheme>
    );
};

export const SliderSkeleton = ({ count = 5 }) => {
    return (
        <SkeletonTheme baseColor="#14213d" highlightColor="#1f2d4d">
            <div className="flex gap-5 overflow-hidden mx-2 md:mx-3 px-1.5 py-2 md:py-3">
                {Array(count).fill(0).map((_, i) => (
                    <div key={i} className="min-w-[160px] md:min-w-[200px] flex flex-col gap-2">
                        <Skeleton height={240} className="rounded-md" />
                        <Skeleton height={18} width="70%" />
                    </div>
                ))}
            </div>
        </SkeletonTheme>
    );
};

export const DetailsSkeleton = () => {
    return (
        <SkeletonTheme baseColor="#14213d" highlightColor="#1f2d4d">
            <div className="max-w-[1536px] mx-auto flex flex-col md:flex-row gap-8 md:gap-10 md:px-20 pt-20 px-4">
                <div className="flex flex-col items-center md:items-start gap-3 min-w-[230px]">
                    <Skeleton height={320} width={230} className="rounded-md" />
                    <Skeleton height={42} width={230} className="rounded" />
                </div>
                <div className="flex-1 flex flex-col gap-4 pt-8">
                    <Skeleton height={40} width="60%" />
                    <Skeleton height={20} width="40%" />
                    <div className="flex gap-3">
                        <Skeleton height={24} width={60} />
                        <Skeleton height={24} width={100} />
                        <Skeleton height={24} width={80} />
                    </div>
                    <Skeleton height={100} className="rounded-md" />
                </div>
            </div>
        </SkeletonTheme>
    );
};

export const PersonDetailsSkeleton = () => {
    return (
        <SkeletonTheme baseColor="#14213d" highlightColor="#1f2d4d">
            <div className="container mx-auto pt-24 pb-12 px-4 md:px-8 flex flex-col md:flex-row gap-8 md:gap-12">
                <div className="min-w-[260px] max-w-[280px] w-full flex flex-col gap-4">
                    <Skeleton height={380} className="rounded-xl" />
                    <Skeleton height={160} className="rounded-xl" />
                </div>
                <div className="flex-1 flex flex-col gap-5">
                    <Skeleton height={45} width="50%" />
                    <Skeleton height={150} className="rounded-xl" />
                    <Skeleton height={30} width="30%" />
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {Array(8).fill(0).map((_, i) => (
                            <Skeleton key={i} height={200} className="rounded-md" />
                        ))}
                    </div>
                </div>
            </div>
        </SkeletonTheme>
    );
};

export const BannerSkeleton = () => {
    return (
        <SkeletonTheme baseColor="#14213d" highlightColor="#1f2d4d">
            <div className="w-full h-[535px] sm:h-[675px] md:h-[610px] p-6 md:p-20 flex flex-col justify-end gap-4 rounded-xl">
                <Skeleton height={50} width="60%" />
                <Skeleton height={80} width="80%" />
                <div className="flex gap-4">
                    <Skeleton height={45} width={120} className="rounded" />
                    <Skeleton height={45} width={140} className="rounded" />
                </div>
            </div>
        </SkeletonTheme>
    );
};

export const CastSkeleton = ({ count = 6 }) => {
    return (
        <SkeletonTheme baseColor="#14213d" highlightColor="#1f2d4d">
            <div className="flex gap-3 overflow-hidden px-8 py-4">
                {Array(count).fill(0).map((_, i) => (
                    <div key={i} className="min-w-[140px] max-w-[140px] flex flex-col gap-2">
                        <Skeleton height={160} className="rounded-t-md" />
                        <Skeleton height={18} width="90%" />
                        <Skeleton height={14} width="60%" />
                    </div>
                ))}
            </div>
        </SkeletonTheme>
    );
};
