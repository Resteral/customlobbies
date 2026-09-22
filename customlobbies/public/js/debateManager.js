// ==========================================================================
// CustomLobbies.com - Debate Arena & Government / Insurance Intelligence System
// ==========================================================================

class DebateManager {
    constructor() {
        this.activeSubTab = 'info'; // 'info', 'battles', 'knocks'
        this.userVotes = {}; // { battleId: 'blue' | 'red' }
        
        this.govData = {
            totalRevenue: '$4.92 Trillion',
            totalSpending: '$6.75 Trillion',
            deficit: '$1.83 Trillion',
            nationalDebt: '$35.4 Trillion',
            revenueSources: [
                { name: 'Individual Income Taxes', amount: '$2.42T', percent: 49, color: '#00f2fe', icon: '👤', desc: 'Direct tax deducted from civilian wages, salaries, and capital investments.' },
                { name: 'Payroll / Social Insurance (FICA)', amount: '$1.71T', percent: 35, color: '#4facfe', icon: '🛡️', desc: 'Dedicated taxes specifically funding Social Security, Medicare Part A, and unemployment.' },
                { name: 'Corporate Income Taxes', amount: '$455B', percent: 9, color: '#ffb703', icon: '🏢', desc: 'Taxes levied on net operational corporate profits and multinational enterprise income.' },
                { name: 'Customs Duties & Excise Taxes', amount: '$198B', percent: 4, color: '#ff0080', icon: '📦', desc: 'Tariffs on foreign imports and excise taxes on fuel, aviation, alcohol, and tobacco.' },
                { name: 'Fed Earnings & Miscellaneous Fees', amount: '$137B', percent: 3, color: '#00ff88', icon: '🏛️', desc: 'Federal Reserve balance sheet interest, national park fees, spectrum auctions, and fines.' }
            ],
            insuranceFlows: [
                { category: 'Social Security (OASDI)', amount: '$1.42 Trillion', type: 'Public', badge: 'Public Trust Fund', beneficiaries: '67 Million Americans', details: 'Monthly retirement and disability income security funded by 12.4% FICA payroll contributions.' },
                { category: 'Medicare (Parts A, B & D)', amount: '$1.05 Trillion', type: 'Public / Hybrid', badge: 'Public Healthcare', beneficiaries: '66 Million Seniors & Disabled', details: 'Universal hospital, outpatient, and prescription coverage for seniors aged 65+ and disability recipients.' },
                { category: 'Medicaid & CHIP Program', amount: '$610 Billion', type: 'Public / State Match', badge: 'Safety Net', beneficiaries: '84 Million Low-Income', details: 'Federal/state joint healthcare financing covering low-income families, nursing home care, and children.' },
                { category: 'Medicare Advantage Subsidies', amount: '$455+ Billion', type: 'Private Subsidies', badge: 'Private Insurance Cash Flow', beneficiaries: '33 Million Enrollees (54%)', details: 'Direct federal capitation checks paid to private insurance giants (UnitedHealth, Humana, Aetna) per enrollee.' },
                { category: 'National Flood Insurance (NFIP)', amount: '$20.5 Billion', type: 'Federal Backstop', badge: 'FEMA Catastrophe', beneficiaries: '4.7M Policyholders', details: 'FEMA-underwritten flood insurance created because private insurers refuse catastrophic coastal flood liabilities.' },
                { category: 'Federal Crop Insurance Subsidies', amount: '$14.2 Billion', type: 'Commercial Backstop', badge: 'Agribusiness', beneficiaries: '1.2M Farms / 500M Acres', details: 'Taxpayers fund roughly 60% of all premium costs for commercial agricultural disaster risk management.' }
            ],
            privateGiants: [
                { name: 'UnitedHealth Group (UNH)', annualRevenue: '$371.6 Billion', netIncome: '$22.4B', marketCap: '$520B', govShare: '~65% from Medicare/Medicaid' },
                { name: 'Elevance Health (ELV)', annualRevenue: '$170.8 Billion', netIncome: '$6.0B', marketCap: '$110B', govShare: '~60% from Gov contracts' },
                { name: 'The Cigna Group (CI)', annualRevenue: '$195.3 Billion', netIncome: '$5.2B', marketCap: '$92B', govShare: '~40% commercial & Medicare' },
                { name: 'Humana Inc. (HUM)', annualRevenue: '$106.4 Billion', netIncome: '$2.5B', marketCap: '$45B', govShare: '~85% Medicare Advantage' }
            ],
            newsFlashpoints: [
                {
                    tag: 'PRESCRIPTION DRUGS',
                    badge: 'IRA Price Cuts',
                    headline: 'Medicare Finalizes First Historic Price Negotiation Deals on Top 10 High-Cost Drugs',
                    summary: 'Direct federal negotiations on blood thinners, diabetes treatments, and heart failure medications take effect, projected to save taxpayers $6 Billion annually and reduce out-of-pocket senior costs by $1.5 Billion.',
                    date: 'September 2026 Briefing',
                    impact: '$7.5B in Total Savings'
                },
                {
                    tag: 'FEDERAL OVERSIGHT',
                    badge: 'Upcoding Probe',
                    headline: 'Department of Justice & HHS Expand Audits into Medicare Advantage Overbilling Schemes',
                    summary: 'Government accountability watchdogs estimate private insurance carriers receive $15B to $30B+ annually in inflated risk-adjustment payments through aggressive diagnostic chart reviews and artificial sickness coding.',
                    date: 'Fiscal Oversight Report',
                    impact: '$30B/yr Taxpayer Scrutiny'
                },
                {
                    tag: 'CLIMATE & PROPERTY',
                    badge: 'Crisis Alert',
                    headline: 'Homeowners Insurance Premium Shocks Sweep High-Risk States as Major Carriers Flee',
                    summary: 'Private underwriters halt writing policies in coastal Florida and wildfire zones across California, doubling consumer rates and driving homeowners into state-backed "insurers of last resort" backed by public taxpayers.',
                    date: 'Real Estate & Insurance Radar',
                    impact: '100%+ Rate Hikes in Zones'
                },
                {
                    tag: 'SOLVENCY CLOCK',
                    badge: 'Trust Fund Cliff',
                    headline: 'Social Security & Medicare Part A Trust Funds Project Automatic Benefit Cuts by 2033–2035',
                    summary: 'Without Congressional action to adjust the $168k+ payroll tax wage cap or modify eligibility criteria, trust fund reserves will deplete, triggering an automatic ~17% to 21% reduction in monthly payments across all beneficiaries.',
                    date: 'Actuarial Trustees Summary',
                    impact: '10-Year Action Window'
                }
            ]
        };

        this.battles = [
            {
                id: 'battle_health',
                title: 'Healthcare Financing & Private Insurers',
                topic: 'Should healthcare coverage be unified under a Single-Payer Government System, or preserved as a Competitive Private Market with Choice?',
                totalVotes: 14280,
                blueVotes: 7996, // 56%
                redVotes: 6284,  // 44%
                blueSide: {
                    name: '🔵 Single-Payer / Universal Reform',
                    subtitle: 'Medicare for All / Single-Payer Advocate',
                    stance: '"Eliminate Corporate Middlemen & Guarantee Healthcare as a Human Right"',
                    arguments: [
                        'Saves an estimated $400B+ yearly in administrative bloat, private insurance profit margins, and billing chaos.',
                        'Gives the federal government unified purchasing leverage to drastically slash prescription drug prices and hospital markups.',
                        'Eliminates medical bankruptcies (over 500,000 Americans go bankrupt each year due to illness) and ties coverage to citizenship, not employment.'
                    ],
                    lobbyTag: 'Lobby-SinglePayer'
                },
                redSide: {
                    name: '🔴 Free Market & Private Choice',
                    subtitle: 'Market Competition & Innovation Defender',
                    stance: '"Preserve Consumer Choice, Speed of Care, and Private Health Tech Innovation"',
                    arguments: [
                        'Government-run monopolies in other nations often suffer from long wait times, specialist shortages, and rationing of cutting-edge therapies.',
                        'Private Medicare Advantage already covers 54% of seniors because people actively choose extra dental, vision, and wellness benefits.',
                        'Forcibly banning private insurance would destroy over 1,000,000 private sector jobs and necessitate massive across-the-board income tax hikes.'
                    ],
                    lobbyTag: 'Lobby-MarketCare'
                }
            },
            {
                id: 'battle_solvency',
                title: 'Social Security & Medicare Solvency Cliff',
                topic: 'How should the federal government prevent the upcoming Trust Fund depletion and protect retirement payouts for future generations?',
                totalVotes: 11840,
                blueVotes: 6867, // 58%
                redVotes: 4973,  // 42%
                blueSide: {
                    name: '🔵 Scrap the Payroll Tax Cap',
                    subtitle: 'Revenue-Side Expansion',
                    stance: '"Tax High Earners Above $400k and Preserve Full Promised Benefits"',
                    arguments: [
                        'Currently, all earnings above ~$168,600 are 100% exempt from the 6.2% Social Security payroll tax—meaning millionaires stop paying in February.',
                        'Applying the payroll tax to incomes over $400,000 completely closes the 75-year solvency deficit without hurting working families.',
                        'Americans paid into the trust fund their entire working lives; cutting benefits or delaying retirement breaks a generational contract.'
                    ],
                    lobbyTag: 'Lobby-TaxTheCap'
                },
                redSide: {
                    name: '🔴 Modernize Retirement Age & Means-Test',
                    subtitle: 'Structural Fiscal Reform',
                    stance: '"Adjust Eligibility to Modern Life Expectancy and Slow Automatic Growth"',
                    arguments: [
                        'When Social Security started in 1935, average life expectancy was 61; today it is ~78. Gradually raising the retirement age to 69–70 aligns with demographic reality.',
                        'Means-testing or curbing benefit formulas for multi-millionaires ensures safety-net dollars go only to those who truly need it.',
                        'Massive payroll tax hikes increase employment costs for businesses and reduce capital investment in the broader economy.'
                    ],
                    lobbyTag: 'Lobby-FiscalReform'
                }
            },
            {
                id: 'battle_climate',
                title: 'Property & Disaster Insurance Crises',
                topic: 'When private insurers flee disaster-prone coastal and wildfire regions, should the government provide public backstops or let market prices rule?',
                totalVotes: 9650,
                blueVotes: 4439, // 46%
                redVotes: 5211,  // 54%
                blueSide: {
                    name: '🔵 National Reinsurance & Public Backstop',
                    subtitle: 'Federal Housing Stability Advocate',
                    stance: '"Protect Homeowners from Foreclosure and Prevent Systemic Housing Collapse"',
                    arguments: [
                        'Without affordable property insurance, banks cannot issue mortgages, leading to sudden home devaluations and wealth destruction for middle-class families.',
                        'A national catastrophic federal reinsurance pool spreads risk across 330 million citizens, lowering spikes after localized hurricane or wildfire events.',
                        'Extreme climate disasters are national emergencies that require coordinated federal disaster safety nets, just like FEMA.'
                    ],
                    lobbyTag: 'Lobby-PublicBackstop'
                },
                redSide: {
                    name: '🔴 End High-Risk Subsidies & Market Pricing',
                    subtitle: 'Risk-Based Market Realism',
                    stance: '"Stop Subsidizing Beachfront Mansions with Inland Taxpayer Dollars"',
                    arguments: [
                        'Subsidized federal flood insurance creates severe moral hazard—encouraging continuous rebuilding in high-risk zones that flood repeatedly.',
                        'Taxpayers in low-risk Midwestern or mountain states shouldn’t be forced to subsidize insurance for multimillion-dollar Florida coastal estates.',
                        'Accurate, high-risk insurance pricing is the most honest economic signal to guide resilient infrastructure and smart urban planning.'
                    ],
                    lobbyTag: 'Lobby-MarketRisk'
                }
            }
        ];
    }

    init() {
        // Load stored user votes
        const stored = localStorage.getItem('customlobbies_debate_votes');
        if (stored) {
            try { this.userVotes = JSON.parse(stored); } catch (e) {}
        }
    }

    setSubTab(tabName) {
        if (typeof soundManager !== 'undefined' && soundManager.playClick) {
            soundManager.playClick();
        }
        this.activeSubTab = tabName;

        document.querySelectorAll('.debate-subtab-btn').forEach(btn => {
            if (btn.getAttribute('data-subtab') === tabName) {
                btn.classList.add('active');
                btn.classList.remove('btn-outline');
                btn.classList.add('btn-primary');
            } else {
                btn.classList.remove('active');
                btn.classList.remove('btn-primary');
                btn.classList.add('btn-outline');
            }
        });

        document.querySelectorAll('.debate-subtab-content').forEach(el => {
            el.style.display = 'none';
        });

        const activeContent = document.getElementById(`debate-tab-${tabName}`);
        if (activeContent) {
            activeContent.style.display = 'block';
            activeContent.classList.add('animate-fade-in');
        }

        if (tabName === 'info') this.renderInformationTab();
        if (tabName === 'battles') this.renderBattlesTab();
        if (tabName === 'knocks') {
            if (typeof app !== 'undefined' && app.renderVoteArenaOverview) {
                app.renderVoteArenaOverview();
            }
        }
    }

    renderDebateArena() {
        this.renderSubTabNavigation();
        this.setSubTab(this.activeSubTab);
    }

    renderSubTabNavigation() {
        const navContainer = document.getElementById('debateSubTabsContainer');
        if (!navContainer) return;

        navContainer.innerHTML = `
            <div class="flex flex-wrap items-center gap-2 border-b border-white/10 pb-3 mb-6">
                <button class="debate-subtab-btn btn btn-sm ${this.activeSubTab === 'info' ? 'btn-primary active' : 'btn-outline'}" 
                        data-subtab="info" onclick="debateManager.setSubTab('info')">
                    <span>📊</span> Gov & Insurance Intelligence (Info Tab)
                </button>
                <button class="debate-subtab-btn btn btn-sm ${this.activeSubTab === 'battles' ? 'btn-primary active' : 'btn-outline'}" 
                        data-subtab="battles" onclick="debateManager.setSubTab('battles')">
                    <span>🥊</span> Live Policy Debate Battles
                </button>
                <button class="debate-subtab-btn btn btn-sm ${this.activeSubTab === 'knocks' ? 'btn-primary active' : 'btn-outline'}" 
                        data-subtab="knocks" onclick="debateManager.setSubTab('knocks')">
                    <span>⚡</span> 5-Second Member Knock Arena
                </button>
            </div>
        `;
    }

    renderInformationTab() {
        const container = document.getElementById('debate-tab-info');
        if (!container) return;

        const rev = this.govData;

        container.innerHTML = `
            <!-- Top Metric Stat Cards -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                <div class="glass-panel p-4 border-l-4 border-neon-cyan">
                    <div class="text-[11px] text-muted uppercase font-bold tracking-wider">Federal Revenue (Receipts)</div>
                    <div class="text-2xl font-black text-neon-cyan mt-1">${rev.totalRevenue}</div>
                    <div class="text-[11px] text-green-400 mt-1">↑ Individual & Payroll Taxes</div>
                </div>
                <div class="glass-panel p-4 border-l-4 border-neon-pink">
                    <div class="text-[11px] text-muted uppercase font-bold tracking-wider">Federal Spending (Outlays)</div>
                    <div class="text-2xl font-black text-neon-pink mt-1">${rev.totalSpending}</div>
                    <div class="text-[11px] text-muted mt-1">Social Ins., Defense & Interest</div>
                </div>
                <div class="glass-panel p-4 border-l-4 border-accent-red">
                    <div class="text-[11px] text-muted uppercase font-bold tracking-wider">Annual Budget Deficit</div>
                    <div class="text-2xl font-black text-accent-red mt-1">${rev.deficit}</div>
                    <div class="text-[11px] text-accent-red/80 mt-1">Funded by U.S. Treasuries</div>
                </div>
                <div class="glass-panel p-4 border-l-4 border-accent-gold">
                    <div class="text-[11px] text-muted uppercase font-bold tracking-wider">Total National Debt</div>
                    <div class="text-2xl font-black text-accent-gold mt-1">${rev.nationalDebt}</div>
                    <div class="text-[11px] text-muted mt-1">Net Interest: ~$900B+/yr</div>
                </div>
            </div>

            <!-- Visual Comparison: Revenue vs Spending & Deficit -->
            <div class="glass-panel p-5 mb-6">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 pb-2 border-b border-white/10">
                    <div>
                        <h3 class="font-bold text-base text-white flex items-center gap-2">
                            <span>📊</span> Fiscal Balance Sheet: Revenue vs. Spending Clash
                        </h3>
                        <p class="text-xs text-muted">The federal government spends $1.37 for every $1.00 collected in tax receipts.</p>
                    </div>
                    <span class="badge badge-danger font-mono font-bold">-$1.83 Trillion Deficit</span>
                </div>

                <!-- Comparison Bars -->
                <div class="space-y-4">
                    <div>
                        <div class="flex justify-between text-xs font-bold mb-1">
                            <span class="text-neon-cyan flex items-center gap-1.5">
                                <span>📥</span> Total Federal Revenue (Receipts)
                            </span>
                            <span class="font-mono text-neon-cyan">$4.92 Trillion (73% of Outlays)</span>
                        </div>
                        <div class="w-full bg-black/60 rounded-full h-4 overflow-hidden border border-white/5 flex">
                            <div class="h-full bg-gradient-to-r from-neon-cyan to-primary-blue rounded-full transition-all duration-700" style="width: 73%;"></div>
                        </div>
                    </div>

                    <div>
                        <div class="flex justify-between text-xs font-bold mb-1">
                            <span class="text-neon-pink flex items-center gap-1.5">
                                <span>📤</span> Total Federal Spending (Outlays)
                            </span>
                            <span class="font-mono text-neon-pink">$6.75 Trillion (100%)</span>
                        </div>
                        <div class="w-full bg-black/60 rounded-full h-4 overflow-hidden border border-white/5 flex">
                            <div class="h-full bg-gradient-to-r from-primary-cyan to-primary-blue rounded-l-full" style="width: 73%;" title="Funded by Revenue"></div>
                            <div class="h-full bg-gradient-to-r from-accent-red to-neon-pink rounded-r-full animate-pulse" style="width: 27%;" title="Deficit Borrowing (Treasury Bonds)"></div>
                        </div>
                        <div class="flex justify-between text-[11px] text-muted mt-1">
                            <span>🟢 Funded by Tax Revenue: $4.92T</span>
                            <span class="text-accent-red font-bold font-mono">🔴 Deficit Borrowing: $1.83T (27%)</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Spending Breakdown by Category & $100 Tax Bill Breakdown -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <!-- Spending Allocation Bar Chart -->
                <div class="glass-panel p-5">
                    <div class="flex justify-between items-center mb-4 pb-2 border-b border-white/10">
                        <h3 class="font-bold text-base text-white flex items-center gap-2">
                            <span>💸</span> Federal Spending by Program Category
                        </h3>
                        <span class="badge badge-dark font-mono text-neon-pink">$6.75T Total</span>
                    </div>

                    <div class="space-y-3.5">
                        <div>
                            <div class="flex justify-between text-xs font-bold mb-1">
                                <span class="text-white flex items-center gap-1.5">👴 Social Security (OASDI)</span>
                                <span class="font-mono text-neon-cyan">$1.42T (21.0%)</span>
                            </div>
                            <div class="w-full bg-black/60 rounded-full h-2.5 overflow-hidden border border-white/5">
                                <div class="h-full bg-primary-cyan rounded-full" style="width: 21%;"></div>
                            </div>
                        </div>

                        <div>
                            <div class="flex justify-between text-xs font-bold mb-1">
                                <span class="text-white flex items-center gap-1.5">🏥 Medicare (Hospital, Outpatient, Rx)</span>
                                <span class="font-mono text-neon-cyan">$1.05T (15.5%)</span>
                            </div>
                            <div class="w-full bg-black/60 rounded-full h-2.5 overflow-hidden border border-white/5">
                                <div class="h-full bg-primary-blue rounded-full" style="width: 15.5%;"></div>
                            </div>
                        </div>

                        <div>
                            <div class="flex justify-between text-xs font-bold mb-1">
                                <span class="text-white flex items-center gap-1.5">📈 Net Interest on National Debt</span>
                                <span class="font-mono text-accent-red font-bold">$890B (13.2%)</span>
                            </div>
                            <div class="w-full bg-black/60 rounded-full h-2.5 overflow-hidden border border-white/5">
                                <div class="h-full bg-accent-red rounded-full" style="width: 13.2%;"></div>
                            </div>
                        </div>

                        <div>
                            <div class="flex justify-between text-xs font-bold mb-1">
                                <span class="text-white flex items-center gap-1.5">🛡️ National Defense (Pentagon)</span>
                                <span class="font-mono text-neon-cyan">$880B (13.0%)</span>
                            </div>
                            <div class="w-full bg-black/60 rounded-full h-2.5 overflow-hidden border border-white/5">
                                <div class="h-full bg-primary-purple rounded-full" style="width: 13%;"></div>
                            </div>
                        </div>

                        <div>
                            <div class="flex justify-between text-xs font-bold mb-1">
                                <span class="text-white flex items-center gap-1.5">🩺 Medicaid & CHIP</span>
                                <span class="font-mono text-neon-cyan">$610B (9.0%)</span>
                            </div>
                            <div class="w-full bg-black/60 rounded-full h-2.5 overflow-hidden border border-white/5">
                                <div class="h-full bg-neon-pink rounded-full" style="width: 9%;"></div>
                            </div>
                        </div>

                        <div>
                            <div class="flex justify-between text-xs font-bold mb-1">
                                <span class="text-white flex items-center gap-1.5">🍲 Safety Net (SNAP, SSI, Tax Credits)</span>
                                <span class="font-mono text-neon-cyan">$400B (5.9%)</span>
                            </div>
                            <div class="w-full bg-black/60 rounded-full h-2.5 overflow-hidden border border-white/5">
                                <div class="h-full bg-accent-gold rounded-full" style="width: 5.9%;"></div>
                            </div>
                        </div>

                        <div>
                            <div class="flex justify-between text-xs font-bold mb-1">
                                <span class="text-white flex items-center gap-1.5">🎖️ Veterans Benefits & VA Health</span>
                                <span class="font-mono text-neon-cyan">$320B (4.7%)</span>
                            </div>
                            <div class="w-full bg-black/60 rounded-full h-2.5 overflow-hidden border border-white/5">
                                <div class="h-full bg-accent-green rounded-full" style="width: 4.7%;"></div>
                            </div>
                        </div>

                        <div>
                            <div class="flex justify-between text-xs font-bold mb-1">
                                <span class="text-white flex items-center gap-1.5">🌐 All Other Discretionary (Transport, Science, Edu, DOJ)</span>
                                <span class="font-mono text-neon-cyan">$1.18T (17.7%)</span>
                            </div>
                            <div class="w-full bg-black/60 rounded-full h-2.5 overflow-hidden border border-white/5">
                                <div class="h-full bg-gray-400 rounded-full" style="width: 17.7%;"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- $100 Tax Dollar Visualizer -->
                <div class="glass-panel p-5 flex flex-col justify-between">
                    <div>
                        <div class="flex justify-between items-center mb-4 pb-2 border-b border-white/10">
                            <h3 class="font-bold text-base text-white flex items-center gap-2">
                                <span>💵</span> Where Every $100 in Spending Goes
                            </h3>
                            <span class="badge badge-success font-mono">$100 Scale</span>
                        </div>

                        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                            <div class="p-2.5 rounded bg-primary-cyan/15 border border-primary-cyan/40 text-center">
                                <div class="text-xl font-black text-primary-cyan">$21.00</div>
                                <div class="text-[10px] text-gray-300 font-bold mt-0.5">Social Security</div>
                            </div>
                            <div class="p-2.5 rounded bg-primary-blue/15 border border-primary-blue/40 text-center">
                                <div class="text-xl font-black text-primary-blue">$15.50</div>
                                <div class="text-[10px] text-gray-300 font-bold mt-0.5">Medicare</div>
                            </div>
                            <div class="p-2.5 rounded bg-accent-red/15 border border-accent-red/40 text-center">
                                <div class="text-xl font-black text-accent-red">$13.20</div>
                                <div class="text-[10px] text-gray-300 font-bold mt-0.5">Debt Interest</div>
                            </div>
                            <div class="p-2.5 rounded bg-primary-purple/15 border border-primary-purple/40 text-center">
                                <div class="text-xl font-black text-primary-purple">$13.00</div>
                                <div class="text-[10px] text-gray-300 font-bold mt-0.5">Defense / Military</div>
                            </div>
                            <div class="p-2.5 rounded bg-neon-pink/15 border border-neon-pink/40 text-center">
                                <div class="text-xl font-black text-neon-pink">$9.00</div>
                                <div class="text-[10px] text-gray-300 font-bold mt-0.5">Medicaid</div>
                            </div>
                            <div class="p-2.5 rounded bg-accent-gold/15 border border-accent-gold/40 text-center">
                                <div class="text-xl font-black text-accent-gold">$5.90</div>
                                <div class="text-[10px] text-gray-300 font-bold mt-0.5">Safety Net / Food</div>
                            </div>
                            <div class="p-2.5 rounded bg-accent-green/15 border border-accent-green/40 text-center">
                                <div class="text-xl font-black text-accent-green">$4.70</div>
                                <div class="text-[10px] text-gray-300 font-bold mt-0.5">Veterans VA</div>
                            </div>
                            <div class="p-2.5 rounded bg-white/10 border border-white/20 text-center">
                                <div class="text-xl font-black text-white">$17.70</div>
                                <div class="text-[10px] text-gray-300 font-bold mt-0.5">All Other Gov</div>
                            </div>
                        </div>

                        <!-- 100 Block Heatmap Grid -->
                        <div class="p-3 bg-black/50 rounded-lg border border-white/5">
                            <div class="text-[11px] text-muted mb-2 font-bold uppercase tracking-wider">100-Block Budget Matrix</div>
                            <div class="grid grid-cols-10 gap-1">
                                ${Array(21).fill('<div class="h-3 rounded-sm bg-primary-cyan" title="$21 Social Security"></div>').join('')}
                                ${Array(15).fill('<div class="h-3 rounded-sm bg-primary-blue" title="$15 Medicare"></div>').join('')}
                                ${Array(13).fill('<div class="h-3 rounded-sm bg-accent-red animate-pulse" title="$13 Debt Interest"></div>').join('')}
                                ${Array(13).fill('<div class="h-3 rounded-sm bg-primary-purple" title="$13 Defense"></div>').join('')}
                                ${Array(9).fill('<div class="h-3 rounded-sm bg-neon-pink" title="$9 Medicaid"></div>').join('')}
                                ${Array(6).fill('<div class="h-3 rounded-sm bg-accent-gold" title="$6 Safety Net"></div>').join('')}
                                ${Array(5).fill('<div class="h-3 rounded-sm bg-accent-green" title="$5 Veterans"></div>').join('')}
                                ${Array(18).fill('<div class="h-3 rounded-sm bg-gray-500" title="$18 All Other"></div>').join('')}
                            </div>
                        </div>
                    </div>

                    <div class="mt-3 pt-3 border-t border-white/10 text-[11px] text-muted flex items-center justify-between">
                        <span>⚡ <strong>75% of spending</strong> is locked in Mandatory Entitlements, Defense & Debt Interest.</span>
                    </div>
                </div>
            </div>

            <!-- Custom Lobby Matchmaker Callout -->
            <div class="glass-panel p-4 mb-6 bg-gradient-to-r from-neon-purple/20 via-black/40 to-neon-cyan/20 border border-neon-cyan/30 flex flex-col md:flex-row items-center justify-between gap-4">
                <div class="flex items-center gap-3">
                    <div class="w-12 h-12 rounded-xl bg-neon-cyan/20 flex items-center justify-center text-2xl">🏛️</div>
                    <div>
                        <h4 class="font-bold text-white text-base">Host a Policy & Budget Debate Scrim in Custom Lobbies</h4>
                        <p class="text-xs text-gray-300">Spin up a dedicated 128-tick VoIP debate room to argue economics, healthcare reform, or government fiscal policy with live community scoring!</p>
                    </div>
                </div>
                <button class="btn btn-primary pulse-btn whitespace-nowrap" onclick="debateManager.createDebateCustomLobby('🏛️ Federal Budget & Healthcare Townhall (128-Tick Scrim)')">
                    🚀 Host Debate Lobby Now
                </button>
            </div>

            <!-- Revenue Sources Breakdown -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div class="glass-panel p-5">
                    <div class="flex justify-between items-center mb-4 pb-2 border-b border-white/10">
                        <h3 class="font-bold text-base text-white flex items-center gap-2">
                            <span>💰</span> Where the Government Gets Its Money
                        </h3>
                        <span class="badge badge-publicity font-mono">~$4.92T Total</span>
                    </div>

                    <div class="space-y-4">
                        ${rev.revenueSources.map(src => `
                            <div>
                                <div class="flex justify-between text-xs font-bold mb-1">
                                    <span class="text-white flex items-center gap-1.5">
                                        <span>${src.icon}</span> ${src.name}
                                    </span>
                                    <span class="font-mono text-neon-cyan">${src.amount} (${src.percent}%)</span>
                                </div>
                                <div class="w-full bg-black/60 rounded-full h-2.5 overflow-hidden border border-white/5">
                                    <div class="h-full rounded-full transition-all duration-500" 
                                         style="width: ${src.percent}%; background-color: ${src.color};"></div>
                                </div>
                                <p class="text-[11px] text-muted mt-1 leading-snug">${src.desc}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Multi-Billion Insurance Machine -->
                <div class="glass-panel p-5">
                    <div class="flex justify-between items-center mb-4 pb-2 border-b border-white/10">
                        <h3 class="font-bold text-base text-white flex items-center gap-2">
                            <span>🛡️</span> The Multi-Billion Public & Private Insurance System
                        </h3>
                        <span class="badge badge-success font-mono">>60% Federal Budget</span>
                    </div>

                    <div class="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                        ${rev.insuranceFlows.map(flow => `
                            <div class="glass-card p-3 border-l-2 border-neon-cyan hover:border-neon-pink transition">
                                <div class="flex justify-between items-center">
                                    <div class="font-bold text-xs text-white">${flow.category}</div>
                                    <span class="badge badge-dark text-neon-cyan font-mono text-xs font-bold">${flow.amount}</span>
                                </div>
                                <div class="flex items-center gap-2 my-1">
                                    <span class="badge badge-publicity text-[10px]">${flow.badge}</span>
                                    <span class="text-[10px] text-muted">${flow.beneficiaries}</span>
                                </div>
                                <p class="text-[11px] text-gray-300 leading-snug">${flow.details}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>

            <!-- Corporate Insurance Giants & Subsidies -->
            <div class="glass-panel p-5 mb-6">
                <div class="flex justify-between items-center mb-3 pb-2 border-b border-white/10">
                    <div>
                        <h3 class="font-bold text-base text-white flex items-center gap-2">
                            <span>🏢</span> Top Private Health Insurance Giants (Billions in Revenue & Federal Subsidies)
                        </h3>
                        <p class="text-xs text-muted">Over 50% of Medicare and 70% of Medicaid dollars are paid to private commercial carriers.</p>
                    </div>
                    <span class="badge badge-dark font-mono">Fortune 50 Giants</span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    ${rev.privateGiants.map(corp => `
                        <div class="glass-card p-3.5 border border-white/5 glow-hover">
                            <div class="font-bold text-sm text-white mb-1">${corp.name}</div>
                            <div class="text-xs text-neon-cyan font-bold font-mono">Revenue: ${corp.annualRevenue}</div>
                            <div class="text-[11px] text-green-400 font-mono">Net Profit: ${corp.netIncome}</div>
                            <div class="text-[11px] text-muted mt-1">Market Cap: ${corp.marketCap}</div>
                            <div class="mt-2 pt-2 border-t border-white/10 text-[10px] text-accent-gold">
                                ⚡ ${corp.govShare}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Real-Time News & Updated Policy Radar -->
            <div class="glass-panel p-5 mb-6">
                <div class="flex justify-between items-center mb-4 pb-2 border-b border-white/10">
                    <h3 class="font-bold text-base text-white flex items-center gap-2">
                        <span>📰</span> Updated News & Real-Time Policy Briefing Radar
                    </h3>
                    <span class="badge badge-publicity pulse-dot">LIVE BRIEFS</span>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${rev.newsFlashpoints.map(news => `
                        <div class="glass-card p-4 border border-white/10 flex flex-col justify-between">
                            <div>
                                <div class="flex items-center justify-between gap-2 mb-2">
                                    <span class="badge badge-dark text-neon-cyan font-bold text-[10px]">${news.tag}</span>
                                    <span class="badge badge-publicity text-[10px]">${news.badge}</span>
                                </div>
                                <h4 class="font-bold text-sm text-white leading-snug mb-2">${news.headline}</h4>
                                <p class="text-xs text-gray-300 leading-relaxed mb-3">${news.summary}</p>
                            </div>
                            <div class="pt-2 border-t border-white/5 flex justify-between items-center text-[11px]">
                                <span class="text-muted font-mono">${news.date}</span>
                                <span class="text-neon-cyan font-bold font-mono">🎯 ${news.impact}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Historical Debt Surge & Taxpayer Contribution Share -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <!-- National Debt Trajectory Timeline -->
                <div class="glass-panel p-5">
                    <div class="flex justify-between items-center mb-4 pb-2 border-b border-white/10">
                        <div>
                            <h3 class="font-bold text-base text-white flex items-center gap-2">
                                <span>📈</span> National Debt & Net Interest Surge
                            </h3>
                            <p class="text-xs text-muted">Debt-to-GDP ratio has reached 124% of the U.S. economy.</p>
                        </div>
                        <span class="badge badge-danger font-mono font-bold">$35.4T Total</span>
                    </div>

                    <div class="space-y-3">
                        <div>
                            <div class="flex justify-between text-xs font-bold mb-1">
                                <span class="text-gray-300">Year 2000 (Dot-Com Era)</span>
                                <span class="font-mono text-neon-cyan">$5.6 Trillion (55% GDP)</span>
                            </div>
                            <div class="w-full bg-black/60 rounded-full h-2 overflow-hidden">
                                <div class="h-full bg-green-400 rounded-full" style="width: 16%;"></div>
                            </div>
                        </div>

                        <div>
                            <div class="flex justify-between text-xs font-bold mb-1">
                                <span class="text-gray-300">Year 2008 (Financial Crisis)</span>
                                <span class="font-mono text-neon-cyan">$10.0 Trillion (68% GDP)</span>
                            </div>
                            <div class="w-full bg-black/60 rounded-full h-2 overflow-hidden">
                                <div class="h-full bg-primary-blue rounded-full" style="width: 28%;"></div>
                            </div>
                        </div>

                        <div>
                            <div class="flex justify-between text-xs font-bold mb-1">
                                <span class="text-gray-300">Year 2017 (Tax Cuts & Jobs Act)</span>
                                <span class="font-mono text-neon-cyan">$20.2 Trillion (103% GDP)</span>
                            </div>
                            <div class="w-full bg-black/60 rounded-full h-2 overflow-hidden">
                                <div class="h-full bg-accent-gold rounded-full" style="width: 57%;"></div>
                            </div>
                        </div>

                        <div>
                            <div class="flex justify-between text-xs font-bold mb-1">
                                <span class="text-gray-300">Year 2020 (COVID Stimulus Relief)</span>
                                <span class="font-mono text-neon-cyan">$27.7 Trillion (128% GDP)</span>
                            </div>
                            <div class="w-full bg-black/60 rounded-full h-2 overflow-hidden">
                                <div class="h-full bg-neon-pink rounded-full" style="width: 78%;"></div>
                            </div>
                        </div>

                        <div>
                            <div class="flex justify-between text-xs font-bold mb-1">
                                <span class="text-white font-black">Year 2026 (Present Day)</span>
                                <span class="font-mono text-accent-red font-bold">$35.4 Trillion (124% GDP)</span>
                            </div>
                            <div class="w-full bg-black/60 rounded-full h-2 overflow-hidden">
                                <div class="h-full bg-gradient-to-r from-accent-red to-neon-pink rounded-full" style="width: 100%;"></div>
                            </div>
                        </div>
                    </div>

                    <div class="mt-4 p-2.5 rounded bg-accent-red/10 border border-accent-red/20 text-[11px] text-gray-300">
                        🚨 <strong>Net Interest Alert:</strong> At ~$890B/year, interest payments on the debt now exceed the entire budget of the U.S. Army, Navy, and Air Force.
                    </div>
                </div>

                <!-- Who Pays the Income Taxes? -->
                <div class="glass-panel p-5 flex flex-col justify-between">
                    <div>
                        <div class="flex justify-between items-center mb-4 pb-2 border-b border-white/10">
                            <div>
                                <h3 class="font-bold text-base text-white flex items-center gap-2">
                                    <span>👥</span> Who Pays Federal Income Taxes?
                                </h3>
                                <p class="text-xs text-muted">Distribution of $2.42T in individual income tax collections.</p>
                            </div>
                            <span class="badge badge-publicity font-mono">IRS Data</span>
                        </div>

                        <div class="space-y-3">
                            <div>
                                <div class="flex justify-between text-xs font-bold mb-1">
                                    <span class="text-primary-cyan font-bold">Top 1% Earners ($680k+ income)</span>
                                    <span class="font-mono text-primary-cyan">42.3% of Total Taxes</span>
                                </div>
                                <div class="w-full bg-black/60 rounded-full h-2.5 overflow-hidden">
                                    <div class="h-full bg-primary-cyan rounded-full" style="width: 42.3%;"></div>
                                </div>
                            </div>

                            <div>
                                <div class="flex justify-between text-xs font-bold mb-1">
                                    <span class="text-primary-blue font-bold">Top 2% to 10% Earners ($170k–$680k)</span>
                                    <span class="font-mono text-primary-blue">31.4% of Total Taxes</span>
                                </div>
                                <div class="w-full bg-black/60 rounded-full h-2.5 overflow-hidden">
                                    <div class="h-full bg-primary-blue rounded-full" style="width: 31.4%;"></div>
                                </div>
                            </div>

                            <div>
                                <div class="flex justify-between text-xs font-bold mb-1">
                                    <span class="text-accent-gold font-bold">Next 40% (Middle Class $50k–$170k)</span>
                                    <span class="font-mono text-accent-gold">24.0% of Total Taxes</span>
                                </div>
                                <div class="w-full bg-black/60 rounded-full h-2.5 overflow-hidden">
                                    <div class="h-full bg-accent-gold rounded-full" style="width: 24.0%;"></div>
                                </div>
                            </div>

                            <div>
                                <div class="flex justify-between text-xs font-bold mb-1">
                                    <span class="text-muted font-bold">Bottom 50% Earners (Under $50k)</span>
                                    <span class="font-mono text-muted">2.3% of Total Taxes</span>
                                </div>
                                <div class="w-full bg-black/60 rounded-full h-2.5 overflow-hidden">
                                    <div class="h-full bg-gray-500 rounded-full" style="width: 2.3%;"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="mt-4 pt-3 border-t border-white/10 text-[11px] text-muted leading-relaxed">
                        💡 <strong>Note on FICA:</strong> While the bottom 50% pays 2.3% of income taxes, they pay a much higher proportion of their total wages in <strong>FICA Payroll Taxes (Social Security & Medicare)</strong>.
                    </div>
                </div>
            </div>
        `;
    }

    renderBattlesTab() {
        const container = document.getElementById('debate-tab-battles');
        if (!container) return;

        container.innerHTML = `
            <div class="hero-banner mb-6">
                <div class="relative z-10 max-w-2xl">
                    <div class="badge badge-publicity mb-2">🥊 Live Policy Battle Arena</div>
                    <h1 class="text-3xl font-extrabold text-white leading-tight">
                        Head-to-Head <span class="text-gradient">Policy Clash</span> & Community Votes
                    </h1>
                    <p class="text-sm text-gray-300 mt-2">
                        Cast your vote on the biggest fiscal, healthcare, and insurance debates facing the nation. See real-time community percentages and spin up instant debate custom lobbies!
                    </p>
                </div>
            </div>

            <div class="space-y-6">
                ${this.battles.map(battle => {
                    const total = battle.blueVotes + battle.redVotes;
                    const bluePct = Math.round((battle.blueVotes / total) * 100);
                    const redPct = 100 - bluePct;
                    const userVote = this.userVotes[battle.id];

                    return `
                        <div class="glass-panel p-5 border border-white/10">
                            <!-- Battle Header -->
                            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-4 pb-3 border-b border-white/10">
                                <div>
                                    <span class="badge badge-publicity text-xs mb-1">CLASH #${battle.id.replace('battle_', '').toUpperCase()}</span>
                                    <h2 class="text-xl font-bold text-white">${battle.title}</h2>
                                    <p class="text-xs text-muted mt-0.5">${battle.topic}</p>
                                </div>
                                <div class="flex items-center gap-2">
                                    <span class="badge badge-dark font-mono text-neon-cyan font-bold">${total.toLocaleString()} Total Votes</span>
                                    <button class="btn btn-xs btn-outline" onclick="debateManager.createDebateCustomLobby('🥊 Debate: ${battle.title.replace(/'/g, "\\'")}')">
                                        🎮 Host Scrim
                                    </button>
                                </div>
                            </div>

                            <!-- Live Vote Meter Bar -->
                            <div class="my-4">
                                <div class="flex justify-between text-xs font-bold font-mono mb-1">
                                    <span class="text-primary-cyan flex items-center gap-1">
                                        🔵 ${battle.blueSide.name} (${bluePct}%)
                                    </span>
                                    <span class="text-accent-red flex items-center gap-1">
                                        (${redPct}%) ${battle.redSide.name} 🔴
                                    </span>
                                </div>
                                <div class="w-full bg-black/80 rounded-full h-4 overflow-hidden flex border border-white/10 p-0.5">
                                    <div class="bg-gradient-to-r from-primary-cyan to-primary-blue rounded-l-full transition-all duration-500 flex items-center justify-start pl-2 text-[10px] font-bold text-black"
                                         style="width: ${bluePct}%;">
                                        ${bluePct > 15 ? bluePct + '%' : ''}
                                    </div>
                                    <div class="bg-gradient-to-r from-accent-red to-neon-pink rounded-r-full transition-all duration-500 flex items-center justify-end pr-2 text-[10px] font-bold text-white"
                                         style="width: ${redPct}%;">
                                        ${redPct > 15 ? redPct + '%' : ''}
                                    </div>
                                </div>
                            </div>

                            <!-- Sides Grid -->
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <!-- Blue Side -->
                                <div class="glass-card p-4 border ${userVote === 'blue' ? 'border-primary-cyan shadow-glow' : 'border-primary-cyan/20'} flex flex-col justify-between">
                                    <div>
                                        <div class="flex justify-between items-center mb-2">
                                            <span class="badge badge-dark text-primary-cyan font-bold">${battle.blueSide.name}</span>
                                            ${userVote === 'blue' ? '<span class="badge badge-success">✓ Your Vote</span>' : ''}
                                        </div>
                                        <h4 class="font-bold text-sm text-white italic mb-2">${battle.blueSide.stance}</h4>
                                        <ul class="space-y-1.5 text-xs text-gray-300">
                                            ${battle.blueSide.arguments.map(arg => `
                                                <li class="flex items-start gap-2">
                                                    <span class="text-primary-cyan font-bold">•</span>
                                                    <span>${arg}</span>
                                                </li>
                                            `).join('')}
                                        </ul>
                                    </div>
                                    <div class="mt-4 pt-3 border-t border-white/10">
                                        <button class="btn btn-block ${userVote === 'blue' ? 'btn-primary' : 'btn-outline'} text-xs font-bold py-2" 
                                                onclick="debateManager.castBattleVote('${battle.id}', 'blue')">
                                            ${userVote === 'blue' ? '✓ Voted Blue Position' : '🗳️ Vote Blue Position'}
                                        </button>
                                    </div>
                                </div>

                                <!-- Red Side -->
                                <div class="glass-card p-4 border ${userVote === 'red' ? 'border-accent-red shadow-pink' : 'border-accent-red/20'} flex flex-col justify-between">
                                    <div>
                                        <div class="flex justify-between items-center mb-2">
                                            <span class="badge badge-dark text-accent-red font-bold">${battle.redSide.name}</span>
                                            ${userVote === 'red' ? '<span class="badge badge-success">✓ Your Vote</span>' : ''}
                                        </div>
                                        <h4 class="font-bold text-sm text-white italic mb-2">${battle.redSide.stance}</h4>
                                        <ul class="space-y-1.5 text-xs text-gray-300">
                                            ${battle.redSide.arguments.map(arg => `
                                                <li class="flex items-start gap-2">
                                                    <span class="text-accent-red font-bold">•</span>
                                                    <span>${arg}</span>
                                                </li>
                                            `).join('')}
                                        </ul>
                                    </div>
                                    <div class="mt-4 pt-3 border-t border-white/10">
                                        <button class="btn btn-block ${userVote === 'red' ? 'btn-danger' : 'btn-outline'} text-xs font-bold py-2" 
                                                onclick="debateManager.castBattleVote('${battle.id}', 'red')">
                                            ${userVote === 'red' ? '✓ Voted Red Position' : '🗳️ Vote Red Position'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    castBattleVote(battleId, side) {
        if (typeof soundManager !== 'undefined') {
            soundManager.playClick();
            if (soundManager.playSuccess) soundManager.playSuccess();
        }

        const battle = this.battles.find(b => b.id === battleId);
        if (!battle) return;

        const previousVote = this.userVotes[battleId];
        if (previousVote === side) {
            if (typeof app !== 'undefined') app.showToast('You already voted for this side!', 'info');
            return;
        }

        // Adjust counts
        if (previousVote === 'blue') battle.blueVotes--;
        if (previousVote === 'red') battle.redVotes--;

        if (side === 'blue') battle.blueVotes++;
        if (side === 'red') battle.redVotes++;

        this.userVotes[battleId] = side;
        localStorage.setItem('customlobbies_debate_votes', JSON.stringify(this.userVotes));

        this.renderBattlesTab();

        if (typeof app !== 'undefined') {
            app.showToast(`Vote recorded for ${side === 'blue' ? battle.blueSide.name : battle.redSide.name}!`, 'success');
        }
    }

    createDebateCustomLobby(title) {
        if (typeof soundManager !== 'undefined' && soundManager.playMatchFound) {
            soundManager.playMatchFound();
        }

        const lobbyObj = {
            id: 'lobby_debate_' + Date.now(),
            title: title || '🏛️ Federal Budget & Healthcare Townhall (128-Tick Scrim)',
            game: 'custom',
            gameName: 'Policy Townhall & Debate',
            mode: '128-Tick Voice Scrim',
            region: 'Global Node Cluster',
            ping: '14ms',
            tier: 'All Welcome / High Trust',
            currentPlayers: 1,
            maxPlayers: 16,
            entryType: 'publicity_vote',
            voiceChannel: 'Built-in 128-Tick WebRTC VoIP',
            rules: 'Civil debate, 3-minute timed arguments, no ad hominem, evidence-based policy.',
            host: {
                name: (typeof app !== 'undefined' && app.currentUser) ? app.currentUser.username : 'GhostRider_99',
                avatar: (typeof app !== 'undefined' && app.currentUser) ? app.currentUser.avatar : 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
                rank: 'Diamond III'
            },
            serverIp: '185.190.140.22:27015',
            tickrate: '128-Tick Dedicated Node',
            tags: ['Debate', 'Gov-Finance', 'Insurance', 'Voice-VoIP']
        };

        if (typeof INITIAL_LOBBIES !== 'undefined') {
            INITIAL_LOBBIES.unshift(lobbyObj);
        }
        if (typeof lobbyManager !== 'undefined' && lobbyManager.lobbies) {
            lobbyManager.lobbies.unshift(lobbyObj);
            lobbyManager.renderLobbies();
        }

        if (typeof app !== 'undefined') {
            app.switchView('lobbies');
            app.showToast('🚀 Debate Custom Lobby created! Direct VoIP room open in Custom Lobbies.', 'success');
        }
    }
}

const debateManager = new DebateManager();
