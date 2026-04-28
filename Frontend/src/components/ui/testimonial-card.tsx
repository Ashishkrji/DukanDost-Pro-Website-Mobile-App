"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Star, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Testimonial {
  name: string;
  title: string;
  quote: string;
  avatarSrc: string;
  rating: number;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  return (
    <div className="w-[380px] flex-shrink-0 group">
      <div className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-sm group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-500 h-full flex flex-col relative overflow-hidden">
        {/* Subtle background quote icon */}
        <Quote className="absolute -top-4 -right-4 w-24 h-24 text-slate-50 opacity-[0.03] rotate-12 group-hover:opacity-[0.05] transition-opacity" />
        
        <div className="flex items-center gap-4 mb-6 relative z-10">
          <div 
            className="w-14 h-14 rounded-2xl bg-slate-100 bg-cover bg-center border-2 border-white shadow-sm"
            style={{ backgroundImage: `url(${testimonial.avatarSrc})` }}
          />
          <div>
            <h4 className="font-display font-bold text-black text-[17px]">{testimonial.name}</h4>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{testimonial.title}</p>
          </div>
        </div>

        <div className="flex gap-1 mb-5 relative z-10">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star 
              key={i} 
              size={12} 
              className={cn(i < Math.floor(testimonial.rating) ? "text-primary fill-primary" : "text-slate-200")} 
            />
          ))}
        </div>

        <p className="text-slate-600 font-medium leading-relaxed italic text-[15px] flex-1 relative z-10">
          &ldquo;{testimonial.quote}&rdquo;
        </p>
      </div>
    </div>
  );
};

export interface ClientsSectionProps {
  tagLabel: string;
  title: string;
  description: string;
  stats: { value: string; label: string }[];
  testimonials: Testimonial[];
  primaryActionLabel: string;
  secondaryActionLabel: string;
  id?: string;
}

export const ClientsSection = ({
  tagLabel,
  title,
  description,
  stats,
  testimonials,
  id,
}: ClientsSectionProps) => {
  // Split testimonials into two rows for the marquee effect
  const midPoint = Math.ceil(testimonials.length / 2);
  const firstRow = testimonials.slice(0, midPoint);
  const secondRow = testimonials.slice(midPoint);

  return (
    <section id={id} className="py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-20 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-8">
          <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          {tagLabel}
        </div>
        <h2 className="font-display text-4xl md:text-6xl font-black tracking-tighter text-black mb-6 leading-tight">
          {title}
        </h2>
        <p className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-12">
          {description}
        </p>

        <div className="flex flex-wrap justify-center gap-12 md:gap-24">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-4xl md:text-5xl font-display font-black text-black mb-1">{stat.value}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Marquee Row 1: Left to Right */}
      <div className="flex gap-6 mb-6">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="flex gap-6 whitespace-nowrap"
        >
          {[...firstRow, ...firstRow, ...firstRow].map((t, i) => (
            <TestimonialCard key={`${t.name}-${i}`} testimonial={t} />
          ))}
        </motion.div>
      </div>

      {/* Marquee Row 2: Right to Left */}
      <div className="flex gap-6">
        <motion.div 
          animate={{ x: [-1000, 0] }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          className="flex gap-6 whitespace-nowrap"
        >
          {[...secondRow, ...secondRow, ...secondRow].map((t, i) => (
            <TestimonialCard key={`${t.name}-${i}`} testimonial={t} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};
