# Enhanced Fat Tree & Data Center Topology Visualizer

## Overview

This is an enhanced version of the original Fat Tree Visualizer by He "Lonnie" Liu, extended to support multiple state-of-the-art (SOTA) data center network topologies including real-world architectures like Google Jupiter and AI-optimized fabrics.

## Supported Topologies

### 1. **Classic Fat Tree**

- **Description**: Traditional 3-tier Clos network with full bisection bandwidth
- **Use Case**: General-purpose data centers, academic research
- **Key Features**:
  - Predictable performance
  - Easy to scale
  - Non-blocking at full capacity
- **Parameters**:
  - Tree Depth (typically 3-5)
  - Ports per Switch (typically 8-64)

### 2. **Google Jupiter**

- **Description**: Google's production Clos fabric using Centauri switches
- **Real-World Stats**:
  - Supports 1.3 Pbps bisection bandwidth
  - Uses custom silicon (OpenFlow-based)
  - 6-stage Clos with 40/100 Gbps links
- **Use Case**: Hyperscale cloud infrastructure, warehouse-scale computing
- **Key Features**:
  - Higher radix switches
  - Software-defined networking (SDN)
  - Optimized for East-West traffic
- **Reference**: Singh et al., "Jupiter Rising: A Decade of Clos Topologies and Centralized Control in Google's Datacenter Network" (SIGCOMM 2015)

### 3. **Dragonfly**

- **Description**: Hierarchical topology with groups of high-radix routers
- **Real-World Usage**:
  - HPE Slingshot (in Frontier, Aurora supercomputers)
  - Cray Aries interconnect
- **Use Case**: High-performance computing (HPC), supercomputers
- **Key Features**:
  - Low diameter (3 hops max)
  - Adaptive routing
  - Cost-effective at scale
  - Global and local links
- **Parameters**:
  - Depth controls number of groups
  - Width controls routers per group and terminals per router

### 4. **Leaf-Spine (Clos)**

- **Description**: 2-tier modern data center architecture
- **Real-World Usage**:
  - AWS, Microsoft Azure, Meta data centers
  - Most modern cloud providers
- **Use Case**: Cloud data centers, enterprise networks
- **Key Features**:
  - Simple, scalable design
  - Every leaf connects to every spine
  - Non-blocking if properly provisioned
  - Easy to add capacity
- **Typical Config**: 16-64 spines, 100s of leaves, 10-100 Gbps links

### 5. **AI-Optimized Fabric**

- **Description**: Custom topology optimized for GPU-to-GPU communication
- **Real-World Examples**:
  - NVIDIA DGX SuperPOD
  - Meta RSC (Research Super Cluster)
  - Microsoft Azure AI clusters
- **Use Case**: Large-scale AI/ML training, LLM training
- **Key Features**:
  - Visualizes GPU servers (green squares = GPUs)
  - High-bandwidth interconnects (400 Gbps InfiniBand NDR, NVLink)
  - Optimized for all-reduce collective operations
  - Support for 8-GPU servers (standard DGX configuration)
- **GPU Stats**: Shows total GPU count across cluster
- **Parameters**:
  - GPUs per Server (typically 4-8 for NVIDIA A100/H100)
  - CPU:GPU Ratio for mixed workloads

## Real-World Data Center Configurations

### Google Jupiter (2015-present)

```
Depth: 6 (5-stage Clos)
Ports per Switch: 128 (64 external links per switch)
Total Scale: 100,000+ servers
Bisection Bandwidth: 1.3 Pbps
Switch Type: Centauri (custom ASIC)
Link Speed: 40/100 Gbps
```

### Meta RSC AI Cluster (2022)

```
Topology: AI-Optimized / Fat Tree hybrid
Total GPUs: 16,000 NVIDIA A100 GPUs
Servers: 2,000 nodes (8 GPUs each)
Network: 200 Gbps NVIDIA Quantum InfiniBand
Tree Depth: 3-4
Purpose: LLM training (Llama models)
```

### Frontier Supercomputer (2022)

```
Topology: Dragonfly (Slingshot-11)
Total Nodes: 9,472 nodes
GPUs: 37,888 AMD MI250X GPUs
Network: HPE Slingshot 200 Gbps
Groups: ~100 groups
Routers per Group: ~64
Peak Performance: 1.1 exaflops
```

### AWS Data Center (Typical Configuration)

```
Topology: Leaf-Spine (Clos)
Spine Switches: 32-64 switches
Leaf Switches: 500-1000 switches
Hosts per Leaf: 40-48 servers
Link Speed: 100/400 Gbps
Oversubscription: 3:1 to 1:1
```

## Usage Instructions

### Running the Visualizer

1. Open `index.html` in a web browser
2. Select topology type from dropdown
3. Adjust parameters:
   - **Tree Depth**: Number of switch layers
   - **Ports per Switch**: Radix of switches
   - **GPUs per Server**: For AI-optimized topology

### Keyboard Shortcuts

- Press `h` to hide/show the control panel

### Experimenting with Configurations

#### Example 1: Small Google Jupiter-like Cluster

```
Topology: Google Jupiter
Depth: 3
Ports per Switch: 32
Expected: ~8K servers, full bisection bandwidth
```

#### Example 2: AI Training Cluster

```
Topology: AI-Optimized Fabric
Depth: 3
Ports per Switch: 16
GPUs per Server: 8
Expected: ~2K servers, 16K GPUs (similar to Meta RSC)
```

#### Example 3: HPC Dragonfly

```
Topology: Dragonfly
Depth: 4 (number of groups)
Ports per Switch: 12 (group size & host connections)
Expected: Low-diameter, adaptive routing network
```

## Technical Details

### Statistics Calculated

- **Hosts**: Total number of servers/compute nodes
- **Switches**: Total switching elements
- **Cables**: Total number of links
- **Transmitters**: Total optical transceivers needed
- **Switch Tx's**: Transceivers in switches (excluding host NICs)
- **Total GPUs**: (AI-Optimized only) Total accelerators
- **Bisection BW**: (Jupiter/Dragonfly/AI) Network bisection capacity

### Color Coding

- **Blue tones**: Google Jupiter components
- **Green tones**: Dragonfly topology
- **Purple tones**: Leaf-Spine architecture
- **Teal/Cyan tones**: AI-optimized fabric
- **Dark blue squares**: Classic fat tree switches
- **Green squares**: GPUs in AI servers

## Future Enhancements (Ideas)

1. **Additional Topologies**:
   - BCube (data center network)
   - DCell (server-centric network)
   - Jellyfish (random regular graph)
   - SlimFly (low-diameter variant)

2. **Performance Metrics**:
   - Network diameter calculation
   - Path diversity analysis
   - Failure tolerance simulation
   - Traffic pattern simulation

3. **Cost Analysis**:
   - CAPEX calculations (switches, cables, optics)
   - Power consumption estimates
   - OPEX modeling

4. **Interactive Features**:
   - Click to highlight paths
   - Failure simulation (remove nodes/links)
   - Traffic heatmap overlay
   - Latency estimation

5. **AI/ML Specific**:
   - Collective communication patterns (AllReduce, AllGather)
   - GPU interconnect topology (NVLink, NVSwitch)
   - Tensor parallel vs data parallel layouts
   - Memory coherence visualization

## References

### Academic Papers

1. **Jupiter**: Singh et al., "Jupiter Rising: A Decade of Clos Topologies and Centralized Control in Google's Datacenter Network", SIGCOMM 2015
2. **Dragonfly**: Kim et al., "Technology-Driven, Highly-Scalable Dragonfly Topology", ISCA 2008
3. **Fat Tree**: Al-Fares et al., "A Scalable, Commodity Data Center Network Architecture", SIGCOMM 2008
4. **VL2/Leaf-Spine**: Greenberg et al., "VL2: A Scalable and Flexible Data Center Network", SIGCOMM 2009

### Industry Resources

- Google Cloud Networking: https://cloud.google.com/blog/products/networking
- NVIDIA DGX SuperPOD: https://www.nvidia.com/en-us/data-center/dgx-superpod/
- Meta RSC: https://ai.meta.com/blog/ai-rsc/
- HPE Slingshot: https://www.hpe.com/us/en/compute/hpc/slingshot-interconnect.html

## Contributing

Feel free to extend this visualizer with:

- New topologies
- Performance calculators
- Interactive simulations
- Real-world configuration presets

## Original Credits

- Original Fat Tree Visualizer by He "Lonnie" Liu
- Repository: https://github.com/h8liu/ftree-vis
- Extended for educational and research purposes

## License

Open source - extend and adapt as needed for research and education.
