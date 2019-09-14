'use strict';

function capitalizeStringStart(str) {
    return str && str[0].toUpperCase() + str.slice(1);
}

class ReactMain extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            generalParameters: {
                brokerFee: 5,
                salesTax: 5,
                facilityBonuses: 0,
                systemCostIndex: 1,
                facilityTax: 10,
                alphaFacilityTax: 10,
                alphaFacilityTaxEnabled: true,
                materials: {
                    minerals: {
                        megacyte: "",
                        isogen: "",
                        mexallon: "",
                        nocxium: "",
                        pyerite: "",
                        tritanium: "",
                        zydrine: "",
                    },
                },
            },
            productions: [],
        };

        this.updateGeneralParameter = this.updateGeneralParameter.bind(this);
        this.updateMineral = this.updateMineral.bind(this);
        this.updateProduction = this.updateProduction.bind(this);
        this.addProduction = this.addProduction.bind(this);
        this.removeProduction = this.removeProduction.bind(this);
    }

    componentDidMount() {
        $('#tabs').tabs();
        $('#para-tabs').tabs();
        $('#prod-tabs').tabs();
        $('[data-toggle="popover"]').popover();

        var generalParameters = (window.localStorage.getItem('generalParameters') && JSON.parse(window.localStorage.getItem('generalParameters'))) || this.state.generalParameters;
        var productions = (window.localStorage.getItem('productions') && JSON.parse(window.localStorage.getItem('productions'))) || this.state.productions;
        this.setState({
            generalParameters,
            productions,
        });
    }

    componentDidUpdate() {
        $('#tabs').tabs('refresh');
        $('#para-tabs').tabs('refresh');
        $('#prod-tabs').tabs('refresh');
        $('[data-toggle="popover"]').popover();
    }

    updateGeneralParameter(name) {
        var main = this;
        return function(value) {
            switch (name) {
                case 'brokerFee':
                case 'salesTax':
                case 'facilityBonuses':
                case 'systemCostIndex':
                case 'facilityTax':
                case 'alphaFacilityTax':
                    value = Number(value);
                    break;
                case 'alphaFacilityTaxEnabled':
                    value = value.toLowerCase() === 'true';
                    break;
            }

            var newGeneralParameters = {
                ...main.state.generalParameters,
            };
            newGeneralParameters[name] = value;

            main.setState({
                generalParameters: newGeneralParameters,
            }, () => {
                window.localStorage.setItem('generalParameters', JSON.stringify(main.state.generalParameters));
            });
        };
    }

    updateMineral(name) {
        var main = this;
        return function(value) {
            value = Number(value);

            var newMinerals = {
                ...main.state.generalParameters.materials.minerals,
            };
            newMinerals[name] = value;

            main.setState({
                generalParameters: {
                    ...main.state.generalParameters,
                    materials: {
                        ...main.state.generalParameters.materials,
                        minerals: newMinerals,
                    }
                },
            }, () => {
                window.localStorage.setItem('generalParameters', JSON.stringify(main.state.generalParameters));
            });
        };
    }

    updateProduction(index, name) {
        var main = this;
        return function(value) {
            switch (name) {
                case 'salePrice':
                case 'baseValue':
                case 'materialEfficiency':
                case 'timeEfficiency':
                    value = Number(value);
                    break;
            }

            var newProduction = {
                ...main.state.productions[index],
            };
            newProduction[name] = value;

            var newProductions = [...main.state.productions];
            newProductions[index] = newProduction;

            main.setState({
                productions: newProductions,
            }, () => {
                window.localStorage.setItem('productions', JSON.stringify(main.state.productions));
            });
        }
    }

    updateProductionMineral(index, name) {
        var main = this;
        return function(value) {
            value = Number(value);

            var newMinerals = {
                ...main.state.productions[index].materials.minerals,
            };
            newMinerals[name] = value;

            var newProduction = {
                ...main.state.productions[index],
                materials: {
                    ...main.state.productions[index].materials,
                    minerals: newMinerals,
                }
            };

            var newProductions = [...main.state.productions];
            newProductions[index] = newProduction;

            main.setState({
                productions: newProductions,
            }, () => {
                window.localStorage.setItem('productions', JSON.stringify(main.state.productions));
            });
        }
    }

    addProduction() {
        this.setState({
            productions: this.state.productions.concat({
                name: 'New Production',
                salePrice: '',
                baseValue: '',
                constructionTime: '',
                materialEfficiency: 0,
                timeEfficiency: 0,
                materials: {
                    minerals: {
                        megacyte: 0,
                        isogen: 0,
                        mexallon: 0,
                        nocxium: 0,
                        pyerite: 0,
                        tritanium: 0,
                        zydrine: 0,
                    }
                }
            })
        }, () => {
            window.localStorage.setItem('productions', JSON.stringify(this.state.productions));
            setTimeout(() => {
                if (this.state.productions.length === 1) {
                    $('#prod-tabs').tabs('option', 'active', 0);
                }
            });
        });
    }

    removeProduction(index) {
        var main = this;
        return function() {
            main.setState({
                productions: main.state.productions.slice(0, index).concat(main.state.productions.slice(index + 1)),
            }, () => {
                window.localStorage.setItem('productions', JSON.stringify(main.state.productions));
            });
        };
    }

    renderGeneralParameters() {
        var renderTaxes = () => {
            return (
                <div id="para-taxes">
                    <FancyInput
                        label="Broker Fee"
                        type="number"
                        required={true}
                        value={this.state.generalParameters.brokerFee}
                        onChange={this.updateGeneralParameter('brokerFee')}
                        append={(
                            <span className="input-group-text"><i className="fas fa-percent"></i></span>
                        )}
                    />
                    <FancyInput
                        label="Sales Tax"
                        type="number"
                        required={true}
                        value={this.state.generalParameters.salesTax}
                        onChange={this.updateGeneralParameter('salesTax')}
                        append={(
                            <span className="input-group-text"><i className="fas fa-percent"></i></span>
                        )}
                    />

                    <p>Everyone starts at 5%, but some skills may reduce this.</p>
                </div>
            );
        }

        var renderManufacturing = () => {
            return (
                <div id="para-manuf">
                    <FancyInput
                        label="Facility Bonuses"
                        type="number"
                        required={true}
                        value={this.state.generalParameters.facilityBonuses}
                        onChange={this.updateGeneralParameter('facilityBonuses')}
                        append={(
                            <React.Fragment>
                                <span className="input-group-text"><i className="fas fa-percent"></i></span>
                                <button className="btn btn-outline-secondary" data-toggle="popover" title="What is this?" data-content="Some facilities may provide bonuses to production, like Raitaru role bonuses.">
                                    <i className="far fa-question-circle"></i>
                                </button>
                            </React.Fragment>
                        )}
                    />
                    <FancyInput
                        label="System Cost Index"
                        type="number"
                        required={true}
                        value={this.state.generalParameters.systemCostIndex}
                        onChange={this.updateGeneralParameter('systemCostIndex')}
                        append={(
                            <React.Fragment>
                                <button className="btn btn-outline-secondary" data-toggle="popover" title="What is this?" data-content="Every system has a cost index, which affects certain prices.">
                                    <i className="far fa-question-circle"></i>
                                </button>
                            </React.Fragment>
                        )}
                    />
                    <FancyInput
                        label="Facility Tax"
                        type="number"
                        required={true}
                        value={this.state.generalParameters.facilityTax}
                        onChange={this.updateGeneralParameter('facilityTax')}
                        append={(
                            <React.Fragment>
                                <span className="input-group-text"><i className="fas fa-percent"></i></span>
                                <button className="btn btn-outline-secondary" data-toggle="popover" title="What is this?" data-content="The owner of the station may decide on a tax paid when using its facilities. 'Show info' on the station, go to 'Services', and see the percent on the right of 'Manufacturing' All NPC stations set tax to 10%.">
                                    <i className="far fa-question-circle"></i>
                                </button>
                            </React.Fragment>
                        )}
                    />
                    <FancyInput
                        label="Alpha Facility Tax"
                        type="number"
                        required={true}
                        value={this.state.generalParameters.alphaFacilityTax}
                        onChange={this.updateGeneralParameter('alphaFacilityTax')}
                        prepend={(
                            <div className="input-group-text">
                                <input
                                    type="checkbox"
                                    checked={this.state.generalParameters.alphaFacilityTaxEnabled}
                                    onChange={(e) => this.updateGeneralParameter('alphaFacilityTaxEnabled')(e.target.checked)}
                                />
                            </div>
                        )}
                        append={(
                            <React.Fragment>
                                <span className="input-group-text"><i className="fas fa-percent"></i></span>
                                <button className="btn btn-outline-secondary" data-toggle="popover" title="What is this?" data-content="Alpha clones pay extra tax, configured here">
                                    <i className="far fa-question-circle"></i>
                                </button>
                            </React.Fragment>
                        )}
                    />
                    
                    <hr/>

                    <p>How are manufacturing costs calculated?</p>
                    <div>Weighted Item Value = Item Base Value * Cost Index</div>
                    <div>Facility Bonuses in ISK = Facility Bonuses Percent * Weighted Item Value</div>
                    <div>Facility Tax in ISK = Facility Tax * (Weighted Item Value - Facility Bonuses in ISK)</div>
                    <div>Alpha Clone Tax = 2%</div>
                    <div>Alpha Clone Tax in ISK = Item Base Value * Alpha Clone Tax</div>
                    <div>Alpha Facility Tax in ISK = Alpha Clone Tax in ISK * Alpha Facility Tax</div>
                    <div>
                        <b>Manufacturing Cost</b> =
                        Weighted Item Value -
                        Facility Bonuses in ISK +
                        Facility Tax in ISK +
                        Alpha Clone Tax in ISK +
                        Alpha Facility Tax in ISK
                    </div>
                </div>
            );
        }

        var renderMaterials = () => {
            return (
                <div id="para-mats">
                    <h2>Minerals</h2>
                    {Object.keys(this.state.generalParameters.materials.minerals).map((mineral) => {
                        var minerals = this.state.generalParameters.materials.minerals;
                        return (
                            <FancyInput
                                key={mineral}
                                label={capitalizeStringStart(mineral)}
                                type="number"
                                required={true}
                                value={minerals[mineral]}
                                onChange={this.updateMineral(mineral)}
                                min="0"
                                append={(
                                    <span className="input-group-text">ISK</span>
                                )}
                            />
                        );
                    })}
                </div>
            );
        }

        return (
            <div id="parameters">
                <div id="para-tabs">
                    <ul>
                        <li><a href="#para-taxes">Market Taxes & Fees</a></li>
                        <li><a href="#para-manuf">Manufacturing Costs</a></li>
                        <li><a href="#para-mats">Materials</a></li>
                    </ul>
                    {renderTaxes()}
                    {renderManufacturing()}
                    {renderMaterials()}
                </div>
            </div>
        );
    }

    renderProduction() {
        return (
            <div id="production">
                <div id="prod-tabs">
                    <ul>
                        {this.state.productions.map((production, index) => (
                            <li key={index}>
                                <a href={`#prod-${index}`}>{production.name}</a>
                                <button
                                    className="btn"
                                    onClick={this.removeProduction(index)}
                                >
                                    <i className="far fa-times-circle"></i>
                                </button>
                            </li>
                        ))}
                        <li className="prodTabsAdd">
                            <button
                                className="btn"
                                onClick={this.addProduction}
                            >
                                <i className="fas fa-plus-circle"></i>
                            </button>
                        </li>
                    </ul>
                    {this.state.productions.map((production, index) => (
                        <div key={index} id={`prod-${index}`}>
                            <FancyInput
                                label="Item Name"
                                type="text"
                                required={true}
                                value={this.state.productions[index].name}
                                onChange={this.updateProduction(index, 'name')}
                            />
                            <FancyInput
                                label="Sale Price"
                                type="number"
                                required={true}
                                value={this.state.productions[index].salePrice}
                                onChange={this.updateProduction(index, 'salePrice')}
                                append={(
                                    <span className="input-group-text">ISK</span>
                                )}
                            />
                            <FancyInput
                                label="Base Value"
                                type="number"
                                required={true}
                                value={this.state.productions[index].baseValue}
                                onChange={this.updateProduction(index, 'baseValue')}
                                append={(
                                    <React.Fragment>
                                        <span className="input-group-text">ISK</span>
                                        <button className="btn btn-outline-secondary" data-toggle="popover" title="What is this?" data-content="Every item has an 'Estimated Price', which affects certain tax and fee calculations.">
                                            <i className="far fa-question-circle"></i>
                                        </button>
                                    </React.Fragment>
                                )}
                            />
                            <FancyInput
                                label="Construction Time"
                                type="text"
                                required={true}
                                value={this.state.productions[index].constructionTime}
                                onChange={this.updateProduction(index, 'constructionTime')}
                            />

                            <h2>Modifiers</h2>
                            <FancyInput
                                label="Material Efficiency"
                                type="number"
                                required={true}
                                value="0"
                                min="0"
                                max="10"
                                step="1"
                                value={this.state.productions[index].materialEfficiency}
                                onChange={this.updateProduction(index, 'materialEfficiency')}
                                append={(
                                    <React.Fragment>
                                        <span className="input-group-text"><i className="fas fa-percent"></i></span>
                                        <button className="btn btn-outline-secondary" data-toggle="popover" title="What is this?" data-content="Blueprints may have bonuses to efficiency. Blueprint originals can be researched to reduce material cost up to 10%.">
                                            <i className="far fa-question-circle"></i>
                                        </button>
                                    </React.Fragment>
                                )}
                            />
                            <FancyInput
                                label="Time Efficiency"
                                type="number"
                                required={true}
                                value="0"
                                min="0"
                                max="20"
                                step="2"
                                value={this.state.productions[index].timeEfficiency}
                                onChange={this.updateProduction(index, 'timeEfficiency')}
                                append={(
                                    <React.Fragment>
                                        <span className="input-group-text"><i className="fas fa-percent"></i></span>
                                        <button className="btn btn-outline-secondary" data-toggle="popover" title="What is this?" data-content="Blueprints may have bonuses to efficiency. Blueprint originals can be researched to reduce manufacturing time up to 20%.">
                                            <i className="far fa-question-circle"></i>
                                        </button>
                                    </React.Fragment>
                                )}
                            />

                            <h2>Materials</h2>
                            <h3>Minerals</h3>
                            {Object.keys(this.state.generalParameters.materials.minerals).map((mineral) => {
                                return (
                                    <FancyInput
                                        key={mineral}
                                        label={capitalizeStringStart(mineral)}
                                        type="number"
                                        value={this.state.productions[index].materials.minerals[mineral]}
                                        onChange={this.updateProductionMineral(index, mineral)}
                                        min="0"
                                        append={(
                                            <span className="input-group-text">Units</span>
                                        )}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    renderOutput() {
        function percentToNumber(percent) { return percent / 100; }

        var renderProduction = (production) => {
            var renderExpenses = () => {
                var renderMinerals = () => {
                    var renderPopover = (minerals) => {
                        var str = '';
                        var mineralRows = minerals.map(mineral => `
                            <div>
                                ${mineral.name}:
                                ${mineral.cost} ISK
                                (${mineral.used} units)
                            </div>
                        `);
                        str += mineralRows.reduce((str, fragment) => str + fragment);
                        return str;
                    }

                    return (
                        <div>
                            Minerals: 
                            {production.totalMineralsExpense} ISK
                            <button
                                className="btn btn-outline-secondary"
                                data-toggle="popover"
                                title="How is this calculated?"
                                data-html={true}
                                data-content={renderPopover(production.minerals)}
                            >
                                <i className="far fa-question-circle"></i>
                            </button>
                        </div>
                    )
                };

                var renderManufacturing = () => {
                    var renderPopover = () => {
                        var str = '';
                        str += `<div>
                            ${production.manufacturingWeightedItemValue} - ${production.manufacturingFacilityBonusesInIsk} + ${production.manufacturingFacilityTaxInIsk}
                        `;
                        if (production.isAlpha) {
                            str += ` + ${production.alphaCloneTaxInIsk} + ${production.alphaFacilityTaxInIsk}`;
                        }
                        str += '</div>';
                        return str;
                    };

                    return (
                        <div>
                            Manufacturing:
                            {production.manufacturingCost} ISK
                            <button
                                className="btn btn-outline-secondary"
                                data-toggle="popover"
                                title="How is this calculated?"
                                data-html={true}
                                data-content={renderPopover()}
                            >
                                <i className="far fa-question-circle"></i>
                            </button>
                        </div>
                    );
                }

                return (
                    <React.Fragment>
                        {renderMinerals()}
                        {renderManufacturing()}
                        <div>
                            Broker Fee:
                            {production.brokerFeeInIsk} ISK ({this.state.generalParameters.brokerFee}%)
                        </div>
                        <div>
                            Sales Tax:
                            {production.salesTaxInIsk} ISK ({this.state.generalParameters.salesTax}%)
                        </div>
                    </React.Fragment>
                );
            }
    
            return (
                <div key={production.name}>
                    <h2>{production.name}</h2>
                    <p>
                        Profit / Unit: {production.profitPerUnit}<br/>
                        Profit / Hour: NOT SUPPORTED YET
                    </p>
                    
                    <h3>Income: {production.income}</h3>
                    
                    <h3>Expenses: {production.expenditures} ISK</h3>
                    {renderExpenses()}
                </div>
            );
        }

        var calculableProductions = this.state.productions.filter(function (production) {
            if (isNaN(Number(production.salePrice)) || production.salePrice === '') {
                return false;
            }
            if (isNaN(Number(production.baseValue)) || production.baseValue === '') {
                return false;
            }
            return true;
        });

        var productionOutputs = calculableProductions.map((production) => {
            var mineralNames = Object.keys(production.materials.minerals);
            var mineralsUse = Object.entries(production.materials.minerals).map(([mineral, amount]) => {
                var materialUseReduction = amount * percentToNumber(production.materialEfficiency);
                var materialUse = amount - materialUseReduction;
                return [mineral, materialUse];
            });
            var mineralsCost = mineralsUse.map(([mineral, amount]) => {
                var mineralCost = this.state.generalParameters.materials.minerals[mineral];
                return mineralCost * amount;
            });
            var totalMineralsExpense = mineralsCost.reduce((prev, cur) => prev + cur);
            var minerals = mineralNames.map((mineral, index) => {
                return {
                    name: mineral,
                    used: mineralsUse[index][1],
                    cost: mineralsCost[index],
                };
            });

            var weightedItemValue = production.baseValue * (this.state.generalParameters.systemCostIndex/100);
            var facilityBonusesInIsk = percentToNumber(this.state.generalParameters.facilityBonuses) * weightedItemValue;
            var facilityTaxInIsk = percentToNumber(this.state.generalParameters.facilityTax) * (weightedItemValue - facilityBonusesInIsk);
            var alphaCloneTax = this.state.generalParameters.alphaFacilityTaxEnabled ? 2 : 0;
            var alphaCloneTaxInIsk = production.baseValue * percentToNumber(alphaCloneTax);
            var alphaFacilityTaxInIsk = alphaCloneTaxInIsk * percentToNumber(this.state.generalParameters.alphaFacilityTax);
            var manufacturingCost = weightedItemValue - facilityBonusesInIsk + facilityTaxInIsk + alphaCloneTaxInIsk + alphaFacilityTaxInIsk;

            var brokerFeeInIsk = production.salePrice * percentToNumber(this.state.generalParameters.brokerFee);
            var salesTaxInIsk = production.salePrice * percentToNumber(this.state.generalParameters.salesTax);

            var totalExpenditures = totalMineralsExpense + manufacturingCost + brokerFeeInIsk + salesTaxInIsk;

            return {
                name: production.name,

                minerals,
                totalMineralsExpense: Math.round(totalMineralsExpense),
                manufacturingWeightedItemValue: weightedItemValue,
                manufacturingFacilityBonusesInIsk: facilityBonusesInIsk,
                manufacturingFacilityTaxInIsk: facilityTaxInIsk,
                isAlpha: this.state.generalParameters.alphaFacilityTaxEnabled,
                alphaCloneTaxInIsk,
                alphaFacilityTaxInIsk,

                manufacturingCost: Math.round(manufacturingCost),

                brokerFeeInIsk: Math.round(brokerFeeInIsk),
                salesTaxInIsk: Math.round(salesTaxInIsk),

                expenditures: Math.round(totalExpenditures),
                income: Math.round(production.salePrice),
                profitPerUnit: Math.round(production.salePrice - totalExpenditures),
            };
        });

        // TODO: Sort by Profit/Hr when implemented
        productionOutputs.sort((a, b) => b.profitPerUnit - a.profitPerUnit);

        return (
            <div id="output">
                {productionOutputs.map(renderProduction)}
            </div>
        );
    }

    render() {
        return (
            <div>
                <h1>Return On Investment calculator</h1>

                <div id="tabs">
                    <ul>
                        <li><a href="#parameters">General Parameters</a></li>
                        <li><a href="#production">Production Items</a></li>
                        <li><a href="#output">Output</a></li>
                    </ul>
                    {this.renderGeneralParameters()}
                    {this.renderProduction()}
                    {this.renderOutput()}
                </div>
            </div>
        );
    }
}

ReactDOM.render(React.createElement(ReactMain), document.getElementById('reactMain'));
