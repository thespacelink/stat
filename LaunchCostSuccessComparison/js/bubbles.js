let heavyData = {
  fy21: {
    title: 'FY21 Dollars',
    values: []
  },
  thenYear: {
    title: 'Then-Year Dollars',
    values: []
  }
}

let mediumData = {
  fy21: {
    values: []
  },
  thenYear: {
    values: []
  }
}

let smallData = {
  fy21: {
    values: []
  },
  thenYear: {
    values: []
  }
}

Highcharts.data({
  googleSpreadsheetKey: "1FGdaphIbRjDpXsOdU3omWGRpH5DTImmzWW-H43lLOms",
  googleSpreadsheetWorksheet: 1,
  switchRowsAndColumns: true,
  parsed: function parsed(columns) {
    columns.splice(0, 2);
    for (let i = 0; i < columns.length; i++) {
      const row = columns[i]
    
       // This will skip the current loop iteration and move to the next one
      if (row[2] == null) {
        continue
      }

      const launchVehicle = row[0];
      let firstLaunchYear = row[1];
      let successfulLaunches = row[2];
      let successIncludingSimilarVehicles = row[3];
      let fy21CostPerKg = row[4];
      let fy21TotalLaunchCost = row[5];
      let thenYearCostPerKg = row[6];
      let thenYearLaunchCost = row[7];
      let launchClass = row[8];
      let country = row[9];
      let similarVehicles = row[10];
      let source = row[11];

      const data = {
        x: firstLaunchYear,
        z: successIncludingSimilarVehicles,
        launchVehicle: launchVehicle,
        successfulLaunches: successfulLaunches,
        launchClass: launchClass,
        country: country,
        similarVehicles: similarVehicles,
        source: source,
      }

      if (successfulLaunches != null && launchClass == "Heavy") {
        heavyData.fy21.values.push({
          ...data,
          y: fy21CostPerKg,
          launchCost: fy21TotalLaunchCost,
          color: '#196C95',
          legendIndex: 1
        })
        
        heavyData.thenYear.values.push({
          ...data,
          y: thenYearCostPerKg,
          launchCost: thenYearLaunchCost,
          color: '#196C95',
          legendIndex: 1
        })

      }

      if (successfulLaunches != null && launchClass == "Medium") {
        mediumData.fy21.values.push({
          ...data,
          y: fy21CostPerKg,
          launchCost: fy21TotalLaunchCost,
          color: '#4F9793',
          legendIndex: 2
        })

        mediumData.thenYear.values.push({
          ...data,
          y: thenYearCostPerKg,
          launchCost: thenYearLaunchCost,
          color: '#4F9793',
          legendIndex: 2
        })
      }

      if (successfulLaunches != null && launchClass == "Small") {
        smallData.fy21.values.push({
          ...data,
          y: fy21CostPerKg,
          launchCost: fy21TotalLaunchCost,
          color: '#F9BC65',
          legendIndex: 3
        })

        smallData.thenYear.values.push({
          ...data,
          y: thenYearCostPerKg,
          launchCost: thenYearLaunchCost,
          color: '#F9BC65',
          legendIndex: 3
        })
      }

    }
    renderChart(
      heavyData.fy21, mediumData.fy21, smallData.fy21
    );
  },
});

function renderChart(heavyData, mediumData, smallData) {
  Highcharts.chart("hcContainer", {
    chart: {
      type: "bubble",
      plotBorderWidth: 1,
      zoomType: "xy",
      backgroundColor: 'rgba(0,0,0,0)'
    },
    legend: {
      title: {
        text: 'Launch Vehicle Class<br/><span style="font-size: 9px; color: #666; font-weight: normal">(Click to hide)</span>',
      },
    },
    credits: {
      enabled: true,
      text: "CSIS Aerospace Security Project"
    },
    title: {
      text:
        "Comparing Cost of Launch to Low-Earth Orbit for Successful Orbital Launch Vehicles",
      margin: 70
    },

    subtitle: {
      text:
        "Bubble sizes correspond to the vehicle's number of successful launches",
    },

    xAxis: {
      gridLineWidth: 1,
      title: {
        text: "Year of First Successful Orbital Launch",
      },
    },

    yAxis: [{
      title: {
        text: "$K / kg (" + heavyData.title + ")",
      },
      type: "logarithmic"
    }],
    tooltip: {
      useHTML: true,
      formatter: function() {
        let launchVehicle = this.point.launchVehicle
        let firstSuccessfulLaunch = this.point.x
        let successfulLaunches = this.point.successfulLaunches
        let successIncludingSimilarVehicles = this.point.z
        let fy21CostPerKg = this.point.y
        let launchCost = this.point.launchCost
        let launchClass = this.point.launchClass
        let country = this.point.country
        let similarVehicles = this.point.similarVehicles
        let source = this.point.source

        let similarVehiclesRow = ''

        if (similarVehicles) {
          similarVehiclesRow = `
            <tr>
            <td>Similar Vehicles (Number of Successful Launches)</td>
            <td>${similarVehicles}</td>
            </tr>
          `
        }

        const html = `
          <span style="font-size: 14px; width: 500px; font-family: 'Roboto'"><b>${launchVehicle}</b></span><br/>
          <table>
            <tr>
              <td class='columnOne'>First Successful Launch</td>
              <td class='columnTwo'>${firstSuccessfulLaunch}</td> 
            </tr> 
            <tr>
              <td class='columnOne'>Successful Launches</td> 
              <td class='columnTwo'>${successfulLaunches}</td>
            </tr>
            <tr>
              <td class='columnOne'>Successful Launches Including Similar Vehicles</td>
              <td class='columnTwo'>${successIncludingSimilarVehicles}</td>
            </tr>
            <tr>
              <td class='columnOne'>Launch Cost Per Kilogram ($/kg)</td> 
              <td class='columnTwo'>${fy21CostPerKg}</td>
            </tr>
              <td class='columnOne'>Total Launch Cost ($M)</td>
              <td class='columnTwo'>${launchCost}</td>
            <tr>
              <td class='columnOne'>Launch Class</td>
              <td class='columnTwo'>${launchClass}</td>
            </tr>
            <tr>
              <td class='columnOne'>Country</td>
              <td class='columnTwo'>${country}</td>
            </tr>
            ${similarVehiclesRow}
            <tr>
              <td class='columnOne'>Source</td>
              <td class='columnTwo'>${source}</td>
            </tr>
          </table>
        `
        $("#tooltip").html(html);
        return false
      },
      followPointer: true,
    },

    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
          format: "{point.name}",
        },
      },
    },
    series: [
      {
        name: "Heavy",
        type: "bubble",
        data: heavyData.values,
      },
      {
        name: "Medium",
        type: "bubble",
        data: mediumData.values,
      },
      {
        name: "Small",
        type: "bubble",
        data: smallData.values
      }
    ],
  });
}

const select = document.getElementById("dropdown");
  select.addEventListener("change", function () {
    let chart = Highcharts.chart("hcContainer", {});
    chart.destroy();
    renderChart(
      heavyData[Object.keys(heavyData)[this.value]], 
      mediumData[Object.keys(mediumData)[this.value]],
      smallData[Object.keys(smallData)[this.value]]
    );
  });