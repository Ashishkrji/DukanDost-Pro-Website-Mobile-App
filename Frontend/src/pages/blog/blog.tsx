import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { PageHeader, Breadcrumb, CTASection, SectionTag } from '../../components/layout/PageComponents';
import { Search, Calendar, User, ArrowRight, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

const BlogCard = ({ category, title, excerpt, date, author, image }: any) => (
  <div className="group cursor-pointer">
     <div className="aspect-[16/10] bg-slate-100 rounded-[3rem] overflow-hidden mb-8 relative">
        <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        <div className="absolute top-6 left-6">
           <span className="bg-white/90 backdrop-blur px-4 py-2 rounded-full text-[10px] font-bold text-[#FF6B00] uppercase tracking-widest shadow-sm">
              {category}
           </span>
        </div>
     </div>
     <div className="space-y-4">
        <div className="flex items-center gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
           <span className="flex items-center gap-2"><Calendar size={12} /> {date}</span>
           <span className="flex items-center gap-2"><User size={12} /> {author}</span>
        </div>
        <h3 className="text-2xl font-display font-semibold text-[#000] group-hover:text-[#FF6B00] transition-colors leading-tight">
           {title}
        </h3>
        <p className="text-slate-500 font-medium line-clamp-2 leading-relaxed">
           {excerpt}
        </p>
        <div className="pt-4 flex items-center gap-3 text-[#FF6B00] font-bold text-[10px] uppercase tracking-widest group-hover:gap-5 transition-all">
           READ ARTICLE <ArrowRight size={14} />
        </div>
     </div>
  </div>
);

export default function Blog() {
  const categories = ["All Posts", "Business Growth", "Product Updates", "Finance Tips", "Case Studies"];

  const posts = [
    { 
      category: "Business Growth", 
      title: "How to Increase Your Shop Sales by 40% in 3 Months", 
      excerpt: "Learn the essential strategies used by top Indian retailers to drive customer loyalty and increase basket size.",
      date: "April 24, 2026",
      author: "Rahul Sharma",
      image: "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=800"
    },
    { 
      category: "Finance Tips", 
      title: "The Ultimate Guide to GST Compliance for Small Businesses", 
      excerpt: "Everything you need to know about GST filing, input tax credit, and keeping your business legally compliant.",
      date: "April 20, 2026",
      author: "Anita Iyer",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800"
    },
    { 
      category: "Product Updates", 
      title: "Introducing Nodal Sync: The Future of Offline Inventory", 
      excerpt: "A deep dive into our latest technology that allows you to manage your stock even without an internet connection.",
      date: "April 15, 2026",
      author: "Vikram Dev",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800"
    }
  ];

  return (
    <MainLayout>
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <Breadcrumb items={[{ name: 'Blog' }]} />
        <PageHeader 
          badge="KNOWLEDGE HUB"
          title="Insights to scale your business."
          subtitle="Explore our curated collection of articles, guides, and stories designed to help the modern Indian shopkeeper thrive."
        />

        {/* Search & Categories */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 my-20">
           <div className="flex flex-wrap items-center gap-4">
              {categories.map((cat, i) => (
                <button 
                  key={i} 
                  className={cn(
                    "px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all",
                    i === 0 ? "bg-[#FF6B00] text-white" : "bg-slate-50 text-slate-500 hover:bg-orange-50 hover:text-[#FF6B00]"
                  )}
                >
                   {cat}
                </button>
              ))}
           </div>
           <div className="relative w-full md:w-80">
              <input type="text" placeholder="Search articles..." className="w-full bg-slate-50 border border-slate-100 rounded-full pl-12 pr-6 py-4 focus:outline-none focus:border-[#FF6B00] transition-colors font-medium text-sm" />
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
           </div>
        </div>

        {/* Featured Post */}
        <div className="mb-32 relative group cursor-pointer">
           <div className="aspect-[21/9] bg-slate-100 rounded-[4rem] overflow-hidden relative">
              <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1600" alt="Featured" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#000]/80 via-transparent to-transparent" />
              <div className="absolute bottom-16 left-16 right-16">
                 <SectionTag>FEATURED ARTICLE</SectionTag>
                 <h2 className="text-3xl md:text-5xl font-display font-semibold text-white mb-6 leading-tight max-w-3xl">DukanDost Pro: The Nodal Center of Modern Indian Retail</h2>
                 <p className="text-slate-300 text-lg font-medium max-w-2xl mb-8">How we're building the infrastructure for the next generation of business growth.</p>
                 <div className="flex items-center gap-3 text-[#FF6B00] font-bold text-xs uppercase tracking-widest group-hover:gap-5 transition-all">
                    READ STORY <ArrowRight size={18} />
                 </div>
              </div>
           </div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-32">
           {posts.map((post, i) => <BlogCard key={i} {...post} />)}
        </div>
      </div>

      <CTASection 
        title="Stay ahead of the curve."
        subtitle="Subscribe to our newsletter and get business growth tips delivered to your inbox every week."
      />
    </MainLayout>
  );
}
