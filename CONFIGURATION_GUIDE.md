# Quick Configuration Guide: Analyzing Real-World Data Centers

## Test Configurations to Try

### 1. Google Jupiter Production Scale (Approximation)

**Settings:**

```
Topology: Google Jupiter
Tree Depth: 5
Ports per Switch: 32
```

**Expected Results:**

- Hosts: ~32,768 servers
- Switches: ~4,096 switches
- Full bisection bandwidth
- Comparable to Jupiter production (2015)

---

### 2. Meta RSC AI Cluster (2022)

**Settings:**

```
Topology: AI-Optimized Fabric
Tree Depth: 3
Ports per Switch: 16
GPUs per Server: 8
```

**Expected Results:**

- Hosts: ~2,048 servers
- Total GPUs: ~16,384 GPUs
- Matches Meta's RSC configuration for Llama training
- High-bandwidth IB fabric

---

### 3. Frontier Supercomputer Network

**Settings:**

```
Topology: Dragonfly
Depth: 6 (represents number of groups)
Ports per Switch: 16 (group size)
```

**Expected Results:**

- Groups with full connectivity
- Low-diameter network (3 hops max)
- Adaptive routing capability
- Similar to HPE Slingshot architecture

---

### 4. AWS/Azure Cloud Data Center Pod

**Settings:**

```
Topology: Leaf-Spine (Clos)
Depth: 4 (determines leaf switches)
Ports per Switch: 16 (spine count)
```

**Expected Results:**

- Non-blocking leaf-spine fabric
- ~512 hosts per pod
- Typical cloud service provider architecture
- Easy horizontal scaling

---

### 5. NVIDIA DGX SuperPOD

**Settings:**

```
Topology: AI-Optimized Fabric
Tree Depth: 3
Ports per Switch: 12
GPUs per Server: 8
```

**Expected Results:**

- ~864 servers
- ~6,912 GPUs
- NVIDIA DGX A100/H100 nodes
- InfiniBand NDR 400 Gbps fabric

---

## Scaling Analysis

### Small Research Cluster

```
Classic Fat Tree
Depth: 2
Ports: 8
Result: ~64 hosts (university research lab)
```

### Medium Enterprise

```
Leaf-Spine
Depth: 3
Ports: 24
Result: ~288 hosts (mid-size company)
```

### Large Cloud Provider

```
Google Jupiter
Depth: 4
Ports: 48
Result: ~55,296 hosts (major cloud zone)
```

### Hyperscale AI Training

```
AI-Optimized
Depth: 4
Ports: 20
GPUs: 8
Result: ~16,000 servers, 128,000 GPUs (OpenAI-scale)
```

---

## Comparison Table

| Topology     | Depth | Ports | Hosts  | Best For   | Real Example           |
| ------------ | ----- | ----- | ------ | ---------- | ---------------------- |
| Fat Tree     | 3     | 16    | 2,048  | General DC | Traditional Enterprise |
| Jupiter      | 5     | 32    | 32,768 | Hyperscale | Google Production      |
| Dragonfly    | 4     | 12    | ~576   | HPC        | Frontier Supercomputer |
| Leaf-Spine   | 4     | 16    | 512    | Cloud      | AWS/Azure/GCP          |
| AI-Optimized | 3     | 16    | 2,048  | AI/ML      | Meta RSC, NVIDIA       |

---

## Performance Characteristics

### Bisection Bandwidth

- **Fat Tree**: Full bisection (1:1)
- **Jupiter**: Full bisection, optimized for Google scale
- **Dragonfly**: Tapered (cost-optimized), adaptive routing compensates
- **Leaf-Spine**: Non-blocking within pod
- **AI-Optimized**: High BW for collective operations (400 Gbps/link)

### Network Diameter

- **Fat Tree**: 2d hops (d = depth)
- **Jupiter**: ~10 hops (5-stage Clos)
- **Dragonfly**: 3 hops maximum
- **Leaf-Spine**: 2 hops (leaf → spine → leaf)
- **AI-Optimized**: Similar to fat tree + NVLink intra-node

### Cost/Performance Trade-offs

1. **Most Cost-Effective**: Dragonfly (for HPC)
2. **Highest Bandwidth**: AI-Optimized (specialized)
3. **Most Flexible**: Leaf-Spine (incremental growth)
4. **Proven at Scale**: Jupiter (Google validated)
5. **Simplest**: Classic Fat Tree (well understood)

---

## Experimentation Ideas

### 1. Scaling Study

Try increasing depth from 2→5 for each topology and observe:

- Switch count growth
- Cable requirements
- Host capacity

### 2. GPU Density Analysis

For AI-Optimized topology:

- Try GPUs/Server: 4, 6, 8, 10
- Calculate total GPU count vs infrastructure cost

### 3. Failure Tolerance

Consider:

- What happens if top-level switch fails?
- How many redundant paths exist?
- Which topology is most resilient?

### 4. Workload Mapping

- **Jupiter**: Web search, ads serving
- **Dragonfly**: Scientific simulations, weather modeling
- **Leaf-Spine**: Microservices, containerized apps
- **AI-Optimized**: Transformer training, LLMs

---

## Advanced Scenarios

### Hybrid Configuration: CPU + GPU Racks

For mixed workloads, consider:

- 70% CPU-only servers (web/DB tier)
- 30% GPU servers (AI inference/training)
- Separate leaf switches per rack type
- Shared spine layer

### Multi-Tenancy

Leaf-Spine is ideal:

- Isolate tenants at leaf layer
- Share spine infrastructure
- VLANs or VXLANs for segmentation

### Edge Computing

- Small Fat Tree (depth=2, ports=8)
- 32 edge servers per location
- Replicate across 100s of locations
- Total: 3,200+ edge nodes globally

---

## Recommended Starting Points

**If you're analyzing:**

- **Cloud infrastructure**: Start with Leaf-Spine, depth=3, ports=24
- **AI/ML clusters**: Start with AI-Optimized, depth=3, ports=16, gpus=8
- **HPC systems**: Start with Dragonfly, depth=4, ports=12
- **General education**: Start with Fat Tree, depth=3, ports=8

**Key Questions to Ask:**

1. What's the total cost (switches + cables + optics)?
2. What's the worst-case latency?
3. How does it handle failures?
4. Can I scale incrementally?
5. What's the power consumption?

---

## Next Steps

1. Open [index.html](index.html) in your browser
2. Select a topology from the list above
3. Enter the configuration parameters
4. Observe the visualization and statistics
5. Compare different topologies for your use case
6. Export or screenshot for presentations

**Pro Tip**: Press 'h' to hide the control panel for cleaner screenshots!
